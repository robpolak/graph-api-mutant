const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const fs = require('fs');
const busboy = require('connect-busboy');
const bodyParser = require('body-parser');
const compression = require('compression');
const http = require('http');

app.set('etag', 'strong')

app.use(compression());

//BusBoy
app.use(busboy({
  limit: {files: 10, fileSize: 1e6 * 10}
}));

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cookieParser());

//API
var api = require('./api/api');
api.initApi(app, function(err, data) {
  console.log('Done Loading GraphQL')
});


//Still seem to need this in some cases
process.on('uncaughtException', function (err) {
  if (err && err.stack) {
    console.trace(err.stack);
  }
});
var server;

//get port from config
var port = 3000;
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
  server.setTimeout(680000);
}


var server = http.createServer(app);
server.timeout = 120 * 1000;
server.listen(port);
server.on('listening', onListening);

server.on('connection', function (socket) {
  socket.setTimeout(120 * 1000);
})

