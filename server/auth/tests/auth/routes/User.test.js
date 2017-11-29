const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/DemoApp_Test';
const User = require('../../../src/model/mongoose/user');
const clearDatabase = async () => {
  User.remove({}, (err) => {
    if (err) return err
  });
};

chai.use(chaiHTTP);
beforeEach((done) => { 
  host = 'http://localhost:8000/'
  done();
});

describe('POST /User/Signup', () => {
  beforeEach((done) => {
    endPoint = 'user/signup';
    clearDatabase().then(done());
  });
  it('should return error with missing data', (done) => {
    chai.request(host).post(endPoint)
    .send({ username: '', password: '' })
    .end((err,res) => {
      expect(res).to.have.status(422);
      done();
    });
  });
  it('should create user and receive the auth token.', (done) => {
    chai.request(host).post(endPoint)
    .send({ username: 'signup@tests.com', password: '1234'})
    .end((err,res) => {
        if (err) return err
        expect(res).to.have.status(200);
        expect(res.body).to.have.deep.property('token')
        done();
    });
  });
});

describe('PUT /user/:email', () => {
 beforeEach((done) => {
    endPoint = 'user/signup@tests.com';
    done();
  });
  it('should return updated:true', (done) => {
    const agent = chai.request.agent(host)
    agent.post('auth/session')
    .send({ username: 'signup@tests.com', password: '1234'})
    .then((res) => {
      agent.put(endPoint)
      .send({ city: "Jaraguá do Sul", age: "26" })
      .end((err, res) => { 
        expect(res).to.have.status(200);
        expect(res.body.updated).to.be.equal(true);  
        done();
      });
    });
  });
});


describe('DELETE /user', () => {
  beforeEach((done) => {
    endPoint = 'user';
    done()
  });
  it('Should delete current logged in user (token)', (done) => {
    new User( { email: 'delete@tests.com', password: '1234' }).save((err, user) => {
      chai.request(host).post('auth/jwt')
        .send({ username: 'delete@tests.com', password: '1234'})
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.deep.property('token')
          chai.request(host)
          .delete(endPoint)
          .set('authorization', res.body.token)
          .end((err,res) => {
            expect(res).to.be.json;
            expect(res.body).to.have.deep.property('deleted');
            expect(res.body.deleted).to.be.equal(true);
            done();
          });
      });
    });
  })

  it('Should delete current logged in user (session)', (done) => {
    new User({ email: 'delete@tests.com', password: '1234' }).save((err, user) => {
      const agent = chai.request.agent(host)
      agent
      .post('auth/session')
      .send({ username: 'delete@tests.com', password: '1234'})
      .then((res) => {
        expect(res).to.have.status(200)
        return agent.delete(endPoint)
        .then((res) => {  
          expect(res).to.be.json;
          expect(res.body).to.have.deep.property('deleted');
          expect(res.body.deleted).to.be.equal(true);
          done();
        });
      });
    });
  });
 
  
  it('Should return invalid data.', (done) => {
    chai.request(host)
    .post('auth/session')
    .send({ username: 'delete@tests.com', password: '1234'})
    .end((err, res) => {
      expect(res).to.have.status(422);
      done();
    });
  });
});

describe('GET /user', () => {
  beforeEach((done) => {
    endPoint = 'user';
    done();
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
