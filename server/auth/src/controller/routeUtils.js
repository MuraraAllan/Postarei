const jwt = require('jsonwebtoken');
const { appSecret } = require('../secret.js');
const findUserID = req => req.session.userID ? req.session.userID : req.userID;

const STATUS_USER_ERROR = 422;
const STATUS_NOT_FOUND = 400;
const STATUS_OK = 200;

const checkUserData = (req) => {
  if (!req.body.username || !req.body.password) {
    return false;
  }
  return true;
};

const sendUserError = (res, msg = 'something goes wrong, please contact support@nothing.com :)' ) => {
  res.status(STATUS_USER_ERROR);
  res.json({error: msg});
};

const sendStatusOk = (res, msg = {ok: true}) => {
  res.status(STATUS_OK);
  res.json(msg);
};

module.exports = {
  STATUS_USER_ERROR,
  STATUS_NOT_FOUND,
  STATUS_OK,
  sendUserError,
  sendStatusOk,
  checkUserData,
  findUserID,
};
