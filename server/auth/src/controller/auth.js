const User = require('../model/mongoose/user');
const { sendUserError, sendStatusOk, checkUserData } = require('./routeUtils');
const fbOauthUtils = require('./oauthUtils').facebook;
const fbUtils = require('../utils/facebookUtils');
const signOut = (req,res) => {
  req.session.destroy((err) => {
    if (err) {
      sendUserError(res, 'You are not logged in');
      return;
    }
    req.session.authenticated = false;
    req.session.destroy();
    sendStatusOk(res, { loggedOut: true });
    return;
  });
}

const addReference = (newUser, refererID) => {
  User.findById(refererID, (err, referer) => {
    const exists = referer.referedUsers.find(referedUser => String(referedUser) === String(newUser));
    if (exists) return true;
    referer.referedUsers = [ ...referer.referedUsers, newUser ];
    referer.save();
  });
}

const formatUser = user => Object.assign({}, { name: user.name }, { avatar: user.avatar }, { fbID: user.fbID });

const persistenceLayer = (req, res, next) => {
  const fbAccessToken = req.session.facebookAccessToken;
  const refererID = req.session.refererID;
  if (fbAccessToken) {
    fbUtils.getCurrentUser(fbAccessToken).then(fbUser => {
      const email = fbUser.id.concat('@facebook.com');
      User.findOne({ email })
       .populate('referedUsers').
        exec((err,user) => {
        if (!user) {
          const fbUserPicture = fbUser.picture.data.url;
          user = new User({ name: fbUser.name, 
                                  fbID: fbUser.id, 
                                  fbAccessToken, 
                                  email, 
                                  avatar: fbUserPicture, 
                                  fbProfilePicture: fbUserPicture
                                 });
          user.save((err) => { if (err) return sendUserError(res, err) });
        }
        if (refererID) { addReference(user._id, refererID); }
        const returnUser = formatUser(user);
        returnUser.referedUsers = user.referedUsers.map(referenceUser => formatUser(referenceUser));
        req.session.user = returnUser;
        req.session.user.authenticated = true;
        next();
      })
    }).catch(err => next());
  } else {
    next();
  }
};


const currentUser = (req, res, next) => {
  if (req.session.user) {
    sendStatusOk(res, req.session.user);
    return;
  }
  sendUserError(res, 'not logged in');
  return;
  next();
}


const recruitNewUser = (req, res, next) => {
  const recruiterID = req.params.recruiterID;
  User.findById(recruiterID, (err, user) => {
    if (user) {
      req.session.refererID = req.params.recruiterID;
      res.redirect('/');
      return;
    }
    sendUserError(res, 'Invalid reference user');
    return;
  });
} 

module.exports = (server) => {
  server.get('/join/:recruiterID', recruitNewUser);
  server.get('/oauth/facebook/callback', fbOauthUtils.facebookOAuthCallback);
  server.use(persistenceLayer);
  server.get('/user', currentUser);
  server.use(fbOauthUtils.redirectToFacebookOauth);
};
