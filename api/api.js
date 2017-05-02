var express = require('express');
var graphqlHTTP = require('express-graphql');
var fs = require('fs');
var path = require('path');
var { buildSchema } = require('graphql');

var apiController = function() {

};

apiController.prototype.initApi = function(app, cb) {
  cb || (cb = function () {
  });
  if (!app) {
    return cb(400, {error: 'badRequest'});
  }

  var resolver = {

  };

  var schema = fs.readFileSync('./api/apiSchema.graphqls', "utf-8");
  var directories = this.$__getDirectories();
  for (var x = 0; x < directories.length; x++) {
    var dir = directories[x];
    var apiSchema = fs.readFileSync(path.join('./api/', dir, dir + '.graphqls'), "utf-8");
    var file = path.join(dir, dir + 'Api.js');
    var apiClass = require('./'+file);
    apiClass.$__wireResolver(resolver);

    schema += apiSchema;
  }
  app.use('/graphqhl', graphqlHTTP({
    schema: buildSchema(schema),
    rootValue: resolver,
    graphiql: true,
  }));
};


apiController.prototype.$__getDirectories = function() {
  return fs.readdirSync('./api').filter(file => fs.statSync(path.join('./api', file)).isDirectory())
};

module.exports = new apiController();