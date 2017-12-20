const User = require('../model/mongoose/user');
const { sendUserError, sendStatusOk, checkUserData } = require('./routeUtils');
const FB = require('fb');
const { facebookID, facebookRedirectUri, facebookSecret } = require('../secret.js');
FB.options({version: 'v2.11'});

const signOut = (req,res) => {
  req.session.destroy((err) => {
    if (err) {
      sendUserError(res, 'You are not logged in');
      return;
    }
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


const restrictedRoutes = (req,res, next) => {
  const fbAccessToken = req.session.facebookAccessToken;
  const refererID = req.session.refererID;
  if (fbAccessToken) {
    FB.api('me', { fields: 'id,name,email', scope:'email', access_token: fbAccessToken }).then(fbUser => {
      const email = fbUser.id.concat('@facebook.com');
      User.findOne({ email }, (err,user) => {
        if (!user) {
          const user = new User({ name: fbUser.name, fbID: fbUser.id, fbAccessToken, email, password: 1234 });
          user.save((err, user) => {
            if (err) return sendUserError(res, err);
            if (refererID) {  
              addReference(user._id, refererID); 
            }
            sendStatusOk(res, user);
            next();
          });
          return;
        }
        if (refererID) {
          addReference(user._id, refererID); 
        }
        sendStatusOk(res, user);
        next();
      })
    });
  } else {
    sendUserError(res, 'You need to Authenticate in order to access the API, please make a POST request to /auth/session with a valid username and password.');
    return;
  }
};


const FacebookOAuth = (req,res,next) => {
//  this.passport.authenticate('facebook');
  const authUrl = FB.getLoginUrl({
    scope: 'email, user_likes, user_photos, user_videos, public_profile, user_friends',
    display: 'popup',
    redirect_uri: facebookRedirectUri,
    appId: facebookID
  });
  res.redirect(authUrl);
  return;
}

const FacebookOAuthCallback = (req, res, next) => {
  FB.api('oauth/access_token', {
      client_id: facebookID,
      scope: 'email, user_likes, user_photos, user_videos, public_profile, user_friends',
      client_secret: facebookSecret, 
      redirect_uri: facebookRedirectUri,
      code: req.query.code
  }).then(facebookRes => {
    req.session.facebookAccessToken = facebookRes.access_token;
    next();
    return;
  }).catch(err => {
    sendUserError(res, JSON.parse(err.message).error.message);
    return;
  });
}

const recruitNewUser = (req, res, next) => {
  const recruiterID = req.params.recruiterID;
  User.findById(recruiterID, (err, user) => {
    if (user) {
      req.session.refererID = req.params.recruiterID;
//      next(FacebookOAuth(req, res, next));
      res.redirect('/oauth/facebook');
      return;
    }
    sendUserError(res, 'Invalid reference user');
    return;
  });
} 

module.exports = (server) => {
  server.get('/oauth/facebook', FacebookOAuth);
  server.get('/join/:recruiterID', recruitNewUser);
  server.get('/oauth/facebook/callback', FacebookOAuthCallback);
  server.use(restrictedRoutes);
};
