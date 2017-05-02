var customerApi = function() {
  var self = this;
};


customerApi.prototype.$__wireResolver = function(resolver) {
  this.resolver = resolver;
  var self = this;
  this.resolver.customers = (() -> self.customers());
}

customerApi.prototype.customers = function(cb) {
  return [{_id: '123', first_name: 'fn', last_name: 'ln'}];
};


module.exports = new customerApi();