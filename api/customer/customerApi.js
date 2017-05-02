var customerController = require('../../src/controllers/customerController');

var customerApi = function() {
  var self = this;
};


customerApi.prototype.$__wireResolver = function(resolver) {
  this.resolver = resolver;
  var self = this;
  this.resolver.customers = (params) => self.customers(params);
}

customerApi.prototype.customers = function(params) {
  return customerController.customers(params);
};


module.exports = new customerApi();