var express = require('express');
var graphqlHTTP = require('express-graphql');
var fs = require('fs');
var path = require('path');

var apiController = function() {

};

apiController.prototype.initApi = function(app, cb) {
  cb || (cb = function(){});
  if(!app) {
    return cb(400, {error:'badRequest'});
  }

  fs.readFile('./api/apiSchema.graphqls', "utf-8", function(err, schema) {
    app.use('/graphqhl', graphqlHTTP({
      schema: schema,
      graphiql: true,
    }));
  })

}


module.exports = new apiController();