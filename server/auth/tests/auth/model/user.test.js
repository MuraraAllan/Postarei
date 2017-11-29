const mocha = require('mocha');
const chai = require('chai');
const { expect, assert } = chai;
const chaiHTTP = require('chai-http');
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost:27017/DemoApp_Test';
mongoose.connect(MONGO_URL);
const User = require('../../../src/model/mongoose/user');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const SALT_COST = 12;

describe('User Model Mongoose Test', () => {
  before((done) => {
    //delete user to force test a new user inside database
    User.remove({ email: 'usermodel@tests.com' }, (err) => {
      if (err) return err;
      done();
    });
  });
  
  describe('test validation for fields', () => {
    before(() => {
      wrongInfo = { email: 'anywrongvalue', password: '123' }
    });
    it('should return err if email is invalid', (done) => {
      User.create(wrongInfo, (err) => {
        expect(err).to.not.be.a('undefined');
        done();
      });
    });
    it('should return err if password is missing', (done) => {
      wrongInfo.email = 'validation@tests.com';
      wrongInfo.password = '';
      User.create(wrongInfo, (err) => {
        expect(err).to.not.be.a('undefined');
        done();
      });
    });
  });

  describe('pre save Encryption hook', (done) => {
    it('should encrypt the password', (done) => {
      User.create({ email: 'usermodel@tests.com', password: '1234' }, function (err, savedUser) {
        if (err) return err
        expect(savedUser.password).to.not.be.equal('1234');
        done();
      });
    }); 
  });

  describe('comparePassword method', () => {
    it('should return false for password 123', (done) => {
      User.findOne({ email: 'usermodel@tests.com' }, (err, user) => {
        user.comparePassword('123').then((res) => {
          expect(res).to.be.equal(false);
          done();
        });
      });
    });
    it('should return true for password 1234', (done) => {
      User.findOne({ email: 'usermodel@tests.com' }, (err, user) => {
        user.comparePassword('1234').then((res) => {
          expect(res).to.be.equal(true);
          done();
        });
      });
    });
  });


});
