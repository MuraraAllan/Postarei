const { sendUserError, sendStatusOk, checkUserData } = require('./routeConstants');
const User = require('../model/mongoose/user'); 
const { getUserToken, findUserID } = require('../utils');

const me = (req,res) => { 
  const userID = findUserID(req);
  User.findById(userID, (err, user) => { 
    return sendStatusOk(res, { user: user.email } ); 
  }); 
};

const signUp = (req, res) => {
  // create a new user and return a valid JWT token to the client
  if (!checkUserData(req)) return sendUserError(res, 'Invalid data');
  const email = req.body.username;
  const password = req.body.password;
  const user = new User({ email, password });
  user.save((err, user) => {
    if (err) return sendUserError(res, err);
    const token = getUserToken(user);
    return sendStatusOk(res, {token});
  });
};

const deleteMe = (req, res) => {
  const userID = findUserID(req);
  User.findByIdAndRemove(userID , (err) => {
    if (err) return sendUserError(err);
    return sendStatusOk(res, { deleted: true } ); 
  }); 
};

const updateUser = (req, res) => {
// create an object containing age and city
// update the mongoose with .update method passing the update object
  const userEmail = req.params.email;
  const age = req.body.age;
  const city = req.body.city;
  const update = {age, city}; 
  User.update({ email: userEmail },{ $set: update }, (err) => {
    if (err) return sendUserError(res, err);
    return sendStatusOk(res, { updated: true });
  });
};

module.exports = (server) => {
  server.get('/user', me);
  server.delete('/user', deleteMe);
  server.put('/user/:email', updateUser);
};
module.exports.signUp = signUp;
