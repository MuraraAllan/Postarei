const express = require('express');
const bodyParser = require('body-parser');
const router = require('./controller/auth');
const server = express();
const { appSecret, mongoUrl } = require('./secret.js');
const session = require('express-session');
const PORT = 8000; 
const mongoose = require('mongoose');
const cors = require('cors');
console.log(mongoUrl);
mongoose.connect(mongoUrl);
mongoose.Promise = global.Promise;
const corsOptions = {
 origin: 'http://localhost:3000',
 credentials: true
};
const sessionOptions = {
  secret: appSecret,
  resave: false,
  saveUninitialized: true,
  secure: 'auto',
  cookie: { maxAge: 86400 },
};

server.set('trust proxy', 1);
server.use(bodyParser.json());
server.use(cors(corsOptions));
server.use(session(sessionOptions));

router(server);

server.listen(PORT, () => { 
  console.log('Server is runing over 8000');
});



