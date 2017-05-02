describe('Campaign Controller Tests', function(){
  var customerController = require('../../src/controllers/customerController');
  var customerRepository = require('../../src/respository/customerRepository');
  var sinon = require('sinon');
  var faker = require('faker');
  var self = this;

  /*chai setup*/
  var chaiAsPromised = require("chai-as-promised");
  var chai = require('chai')
  chai.use(chaiAsPromised);
  var expect = require('chai').expect;
  var assert = require('chai').assert;


  this.customerArray = [];

  /**
   * stub fake data.
   */
  for(var x = 0; x < 1000; x++) {
    this.customerArray.push({
      _id: faker.random.uuid(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
    });
  }

  beforeEach(function(){

  });

  afterEach(function(){
    if(customerRepository.customers && customerRepository.customers.restore) {
      customerRepository.customers.restore();
    }
  });

  describe('customerController.customers',function(){
    it('is a function',function(){
      expect(customerController.customers).to.be.a('function');
    })

    it('returns a promise',function() {
      var stub = sinon.stub(customerRepository, 'customers');
      var returnValue = customerController.customers({})
        .catch((error) => {
          //do nothing
        });

      expect(returnValue).to.be.a('promise');
    })

    it('missing limit',function() {
      var deferred = Promise.defer();
      sinon.stub(customerRepository, 'customers').returns(deferred.promise);

      var customerPromise = customerController.customers({skip: 1, sort_field: 'first_name', sort_direction: 'asc'});
      deferred.resolve(self.customerArray);

      return expect(customerPromise).to.be.rejectedWith('Missing Parameter: limit');
    })

    it('missing skip',function() {
      var deferred = Promise.defer();
      sinon.stub(customerRepository, 'customers').returns(deferred.promise);

      var customerPromise = customerController.customers({limit: 1, sort_field: 'first_name', sort_direction: 'asc'});
      deferred.resolve(self.customerArray);

      return expect(customerPromise).to.be.rejectedWith('Missing Parameter: skip');
    })

    it('missing sort_field',function() {
      var deferred = Promise.defer();
      sinon.stub(customerRepository, 'customers').returns(deferred.promise);

      var customerPromise = customerController.customers({limit: 1, skip: 1, sort_direction: 'asc'});
      deferred.resolve(self.customerArray);

      return expect(customerPromise).to.be.rejectedWith('Missing Parameter: sort_field');
    })

    it('missing sort_direction',function() {
      var deferred = Promise.defer();
      sinon.stub(customerRepository, 'customers').returns(deferred.promise);

      var customerPromise = customerController.customers({limit: 1, skip: 1, sort_field: 'first_name'});
      deferred.resolve(self.customerArray);

      return expect(customerPromise).to.be.rejectedWith('Missing Parameter: sort_direction');
    })
  });


/*
    it('calls the repository',function(){
      var stub = sinon.stub(campaignRepository, 'addToCampaignSubdoc');
      var campaign = {_id:1234,permissions:[1,2,3]};
      campaignController.addCampaignPermission(campaign,{});
      expect(stub.callCount).to.eql(1);
    })*/


});
