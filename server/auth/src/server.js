const express = require('express');
const bodyParser = require('body-parser');
const router = require('./controller/auth');
const server = express();
const session = require('express-session');
const PORT = 8000; 
const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/DemoApp_Test';
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

mongoose.connect(MONGO_URL);
mongoose.Promise = global.Promise;
const { appSecret } = require('./secret.js');
const sessionOptions = {
  secret: appSecret,
  resave: false,
  saveUninitialized: true,
  secure: 'auto',
  cookie: { maxAge: 86400 },
};

passport.use(new FacebookStrategy({
  clientID: 877864285711370,
  clientSecret: '8b7083ae36d57327fb63a38d244e435b',
  callbackURL: "http://localhost:8000/oauth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    //User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //  return cb(err, user);
//    });
    console.log('here comes accessToken', accessToken);
    console.log('here comes profile', profile);
  }
));

server.set('trust proxy', 1);
server.use(bodyParser.json());
server.use(passport.initialize());
server.use(passport.session());
server.use(session(sessionOptions));

server.get('/login/facebook',
passport.authenticate('facebook'));
router(server, passport);

server.listen(PORT, () => { 
  console.log('Server is runing over 8000');
});



