const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const fs = require('fs');
const busboy = require('connect-busboy');
const bodyParser = require('body-parser');
const compression = require('compression');


app.set('etag', 'strong')

app.use(function (req, res, next) {
  req.$__workspaceLoadStart = moment();
  next();
});

app.use(compression());

//BusBoy
app.use(busboy({
  limit: {files: 10, fileSize: 1e6 * 10}
}));

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

//JADE
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

//EXPRESS
app.use(express.static(path.join(__dirname, 'public')));
app.use('/app', express.static(path.join(__dirname, 'app')));

app.use(cookieParser());

//Get User
var userModule = require('./src/expressModules/userModule');
app.use(userModule);

// Loggly
if (global._config.logging.requestLoggingEnabled) {
  app.use(global._logger.requestLogger);
}


//API
require('./api/api')(app);

//Routes
app.use('/', require('./routes/public_routes'));
app.use('/', require('./routes/workspace_routes'));

if (global._config.logging.responseLoggingEnabled) {
  app.use(global._logger.responseLogger);
}
//Express exception handler
app.use(function errorHandler(err, req, res, next) {
  req || (req = {});
  err || (err = {});
  res.status(500).send();
  res.end();
  var obj = {
    err: err,
    path: req.path,
    user: req.user,
  };
  global._logger.logError("Express Uncaught Exception", obj);
  console.trace(err.stack);
});

//no routes below this
app.get('*', function defaultRoute(req, res) {
  global._logger.logTrace('404 Not Found', req.originalUrl);
  res.redirect(302, '/#/Error/NotFound');
  res.end();
});

//Still seem to need this in some cases
process.on('uncaughtException', function (err) {
  global._logger.logError("Uncaught Exception", err);
  if (err && err.stack)
    console.trace(err.stack);
});
var server;

//get port from config
var port = global._config.port;
port = normalizePort(port || '3000');
app.set('port', port);


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  global._logger.logTrace('Listening on ' + bind, 'HTTP');
  server.setTimeout(680000);
}


server = http.createServer(app);
server.timeout = 120 * 1000;
server.listen(port);
server.on('listening', onListening);

server.on('connection', function (socket) {
  socket.setTimeout(120 * 1000);
})

