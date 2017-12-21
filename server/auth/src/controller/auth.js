const User = require('../model/mongoose/user');
const { sendUserError, sendStatusOk, checkUserData } = require('./routeUtils');
const FB = require('fb');
const { facebookID, facebookRedirectUri, facebookSecret } = require('../secret.js');
FB.options({version: 'v2.11'});
FB.options('display', 'popup');

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

// NEED REFACTOR 
const formatUser = user => Object.assign({}, { name: user.name }, { avatar: user.avatar });

const restrictedRoutes = (req,res, next) => {
  const fbAccessToken = req.session.facebookAccessToken;
  const refererID = req.session.refererID;
  if (fbAccessToken) {
    FB.api('me', { fields: 'id,name,email,picture', scope: 'email', access_token: fbAccessToken }).then(fbUser => {
      const email = fbUser.id.concat('@facebook.com');
      User.findOne({ email }, (err,user) => {
        if (!user) {
          const fbUserPicture = fbUser.picture.data.url;
          const user = new User({ name: fbUser.name, 
                                  fbID: fbUser.id, 
                                  fbAccessToken, 
                                  email, 
                                  avatar: fbUserPicture, 
                                  fbProfilePicture: fbUserPicture 
                               });
          user.save((err, user) => {
            if (err) return sendUserError(res, err);
            if (refererID) {  
              addReference(user._id, refererID); 
            }
            const returnUser = formatUser(user);
            req.session.user = returnUser;
            req.session.user.authenticated = true;
            next();
          });
          return;
        }
        if (refererID) {
          addReference(user._id, refererID); 
        }
        const returnUser = formatUser(user);
        req.session.user = returnUser;
        req.session.user.authenticated = true;
        next();
      })
    });
  } else {
    sendUserError(res, 'You need to Authenticate in order to access the API, please make a POST request to /auth/session with a valid username and password.');
    return;
  }
};


const FacebookOAuth = (req, res, next) => {
//  this.passport.authenticate('facebook');
  req.session.redirect = true;
  const authUrl = FB.getLoginUrl({
    display: 'popup',
    scope: 'email, user_likes, user_photos, user_videos, public_profile, user_friends',
    redirect_uri: facebookRedirectUri,
    appId: facebookID
  });
  res.redirect(authUrl);
  return;
}

const currentUser = (req, res, next) => {
   if (req.session.redirect) {
    res.status(200);
    delete   req.session.redirect;
    res.redirect('http://localhost:3000/posting');
    return;
  }
    
  sendStatusOk(res, req.session.user);
  return;
}

const FacebookOAuthCallback = (req, res, next) => {
  req.session.redirect = true;
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
  server.get('/user', currentUser);
  server.use(currentUser);
};
