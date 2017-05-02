var faker = require('faker');
var customerRepository = require('../respository/customerRepository');

var customerController = function() {

};


customerController.prototype.customers = function(params) {
  var self = this;
  return new Promise((resolve, reject) => {
    if (typeof(params.limit) != 'number') {
      return reject(`Missing Parameter: limit`);
    }
    if (typeof(params.skip) != 'number') {
      return reject(`Missing Parameter: skip`);
    }
    if (!params.sort_field) {
      return reject(`Missing Parameter: sort_field`);
    }
    if (!params.sort_direction) {
      return reject(`Missing Parameter: sort_direction`);
    }



    var customerPromise = customerRepository.customers(params);
    customerPromise.then((customers) => {
      resolve(customers);
    });

    customerPromise.catch((err) => {
      reject(err);
    });
  });
};


module.exports = new customerController();