var faker = require('faker');
var _ = require('underscore');

var customerRepository = function() {
  var self = this;
  self.customerArray = [];

  /**
   * stub fake data.
   */
  for(var x = 0; x < 1000; x++) {
    self.customerArray.push({
      _id: faker.random.uuid(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
    });
  }

};


/**
 * Get Customers
 * @param params.limit
 * @param params.skip
 * @param params.sort_field
 * @param params.sort_direction
 * @returns {Promise}
 */
customerRepository.prototype.customers = function(params) {
  var self = this;
  return new Promise((resolve, reject) => {
    var formattedCustomers = self.$__formatCustomers(params);
    resolve(formattedCustomers);
  });
};

/**
 * Formats our fake data array to simulate a DB query
 * @param params
 * @returns {Array}
 */
customerRepository.prototype.$__formatCustomers = function(params) {
  var formattedCustomers = this.customerArray;

  if(params.sort_field) {
    formattedCustomers = _.sortBy(formattedCustomers, params.sort_field);
  }
  if(params.sort_direction) {
    switch(params.sort_direction.toLowerCase()) {
      case 'asc':
        //already asc.. do nothing
        break;
      case 'desc':
        formattedCustomers = formattedCustomers.reverse(); //reverse for desc order
        break;
    }
  }


  if(params.skip) {
    formattedCustomers = formattedCustomers.slice(params.skip, formattedCustomers.length - params.skip);
  }
  if(params.limit) {
    formattedCustomers = formattedCustomers.slice(0, params.limit);
  }
  return formattedCustomers;
}


module.exports = new customerRepository();