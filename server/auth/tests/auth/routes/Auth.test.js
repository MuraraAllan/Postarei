const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/DemoApp_Test';
const User = require('../../../src/model/mongoose/user');


chai.use(chaiHTTP);
beforeEach((done) => { 
  host = 'http://localhost:8000/'    
  done();
});
before(() => {
  User.remove({}, (err) => {
   if (err) return err
  });
  new User( { email: 'signup@tests.com', password: '1234' }).save()
});
describe('Authentication Over JWT', () => {
  describe('/auth/jwt', () => {
    beforeEach(() => {
      endPoint = 'auth/jwt';
    });
    it('should return invalid if no user or password', (done) => {
      chai.request(host).post(endPoint)
      .send({ username: '', password: ''})
      .end((err,res) => {
        expect(res).to.have.status(422);
        done();
      });
    });
    it('should return invalid if trying to login with invalid username/password combination', (done) => {  
      chai.request(host).post(endPoint)
      .send({ username: 'uuu', password: 'aaa'})
      .end((err,res) => {
        expect(res).to.have.status(422);
        done();
      });
    });
    it('should return status ok and a token if user and password are right', (done) => {
      chai.request(host).post(endPoint)
      .send({ username: 'signup@tests.com', password: '1234'})
      .end((err,res) => {
        if (err) done(err)
        expect(res).to.have.status(200);
        expect(res.body).to.have.deep.property('token')
        done();
      });
    });
  });
});

describe('Authentication over Session', () => {
  describe('/auth/session', () => {
    beforeEach(() => {
      endPoint = 'auth/session';
    });
    it('should return invalid if no user or password', (done) => {
      chai.request(host).post(endPoint)
        .send({ username: '', password: ''})
        .end((err,res) => {
          expect(res).to.have.status(422);
          done();
      });
    });
    it('should return invalid if trying to login with invalid username/password combination', (done) => {  
      chai.request(host).post(endPoint)
      .send({ username: 'uuu', password: 'aaa'})
      .end((err,res) => {
        expect(res).to.have.status(422);
        done();
      });
    });
    it('should return status ok if user and password are right', (done) => {
      const agent = chai.request.agent(host)
      agent
      .post(endPoint)
      .send({ username: 'signup@tests.com', password: '1234'})
      .end((err,res) => {
        expect(res).to.have.status(200);
        done();
      });
    });
  });
});

describe('Sign Out', () => {
  beforeEach((done) => {
    endPoint = 'auth/signout';
    done();
  });
  it('Should delete the session, when try to reach', (done) => { 
    const agent = chai.request.agent(host)
    agent
    .post('auth/session')
    .send({ username: 'signup@tests.com', password: '1234'})
    .then((err, res) => {
      agent
      .post(endPoint)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
    });
  });  
});

describe('Check if user is authenticated for private Routes', () => {
  beforeEach((done) => {
    endPoint = 'user';
    done();
  });
  it('should return user not logged in if trying to access /me without tokenand session', (done) => {
     chai.request(host).get(endPoint)
     .end((err,res) => {
       expect(res).to.have.status(422);
       expect(res.body.error).to.be.equal('You need to Authenticate in order to access the API, please make a POST request to /auth/session with a valid username and password.');
       done();
     });
  });
  it('Should return username if logged in (token)', (done) => {
    chai.request(host).post('auth/jwt')
      .send({ username: 'signup@tests.com', password: '1234'})
      .end((err,res) => {
        if (err) console.log(err)
        expect(res).to.have.status(200);
        expect(res.body).to.have.deep.property('token')
        chai.request(host)
        .get('user')
        .set('authorization', res.body.token)
        .end((err,res) => {
          expect(res).to.be.json;
          expect(res.body).to.have.deep.property('user');
          expect(res.body.user).to.be.equal('signup@tests.com');
          done();
        });
    });
  })
  it('Should return username if logged in (session)', (done) => {
    const agent = chai.request.agent(host)
    agent
    .post('auth/session')
    .send({ username: 'signup@tests.com', password: '1234'})
    .then((res) => {
      expect(res).to.have.status(200);
      return agent.get(endPoint)
      .then((res) => {
        expect(res).to.be.json;
        expect(res.body).to.have.deep.property('user');
        expect(res.body.user).to.be.equal('signup@tests.com');
        done();
      });
    });
  });
});
