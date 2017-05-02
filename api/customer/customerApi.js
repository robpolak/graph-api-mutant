var customerApi = function() {
  var self = this;
};


customerApi.prototype.$__wireResolver = function(resolver) {
  this.resolver = resolver;
  var self = this;
  this.resolver.customers = (params, request, cb) => self.customers(params, request, cb);
}

customerApi.prototype.customers = async function(params, request, cb) {

  var customers = await
  request.res.end(200, [{_id: '123', first_name: 'fn', last_name: 'ln'}]);
};


module.exports = new customerApi();