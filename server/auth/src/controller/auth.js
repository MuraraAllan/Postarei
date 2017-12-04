const User = require('../model/mongoose/user');
const { getUserToken, verifyToken } = require('../utils');
const { sendUserError, sendStatusOk, checkUserData } = require('./routeConstants');
const userRoutes = require('./user');
const FB = require('fb');
const { facebookID, facebookRedirectUri, facebookSecret } = require('../secret.js');
FB.options({version: 'v2.11'});

const signIn = (req,res) => {
  if (!checkUserData(req)) {
    sendUserError(res, 'Invalid data');
    return;
  }
  const reqUsername = req.body.username;
  const reqPassword = req.body.password;
  // generate a JWT token if the username/password is valid
  // JWT will contain : userID, accessLevel for graphql API resolvers 
  User.findOne({ email : reqUsername }, (err,user) => {
    if (!user) {
      sendUserError(res, 'Invalid Password/Username combination :(');
      return;
    }
    user.comparePassword(reqPassword).then((valid) => {
      if (valid != true) {
        sendUserError(res,'Invalid Password/Username combination :(');
        return;
      }
      // distinguish between jwt accesspoint or session
      if (req.path === '/auth/jwt') {
        const token = getUserToken(user); 
        sendStatusOk(res, {token});
        return;
      }
      req.session.userID = user.id;
      sendStatusOk(res, {logged: true}); 
    });
  });
};

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

const restrictedRoutes = (req,res, next) => {
  const fbAccessToken = req.session.facebookAccessToken;
  console.log(fbAccessToken);
  if (fbAccessToken) {
    FB.api('me', { fields: 'id,name,email', scope:'email', access_token: fbAccessToken }).then(fbUser => {
      const email = fbUser.id.concat('@facebook.com');
      User.findOne({ email }, (err,user) => {
        if (!user) {
          const user = new User({ name: fbUser.name, fbID: fbUser.id, fbAccessToken, email, password: 1234 });
          user.save((err, user) => {
            if (err) return sendUserError(res, err);
            sendStatusOk(res, 'aaa'+user);
            return;
          });
        return;
        }
        sendStatusOk(res, user);
      })
    })
    return;
   }

  const token = req.headers['authorization'];
  if (token) {
    const decoded = verifyToken(req.headers['authorization']);
    if (decoded === undefined) {
      sendUserError(res, 'Your token is invalid, please login again');
      return;
    }
    req.userID = decoded.data.id;
    next();
    return;
  }
  if (!req.session.userID) {
    sendUserError(res, 'You need to Authenticate in order to access the API, please make a POST request to /auth/session with a valid username and password.');
    return;
  }
  next();
};


const FacebookOAuth = (req,res,next) => {
//  this.passport.authenticate('facebook');
  const authUrl = FB.getLoginUrl({
    scope: 'email, user_likes, user_photos, user_videos, public_profile, user_friends',
    redirect_uri: facebookRedirectUri,
    appId: facebookID
  });
  res.redirect(authUrl);
  return;
}

const FacebookOAuthCallback = (req,res, next) => {
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
module.exports = (server) => {
  server.post('/user/signup', userRoutes.signUp);
  server.post('/auth/signout', signOut);
  server.post('/auth(/jwt|/session)$/', signIn);
  //  server.post('/auth/linkedin/*', LinkedInAuth);
  server.get('/oauth/facebook', FacebookOAuth);
  server.get('/oauth/facebook/callback', FacebookOAuthCallback);
  server.use(restrictedRoutes);
  userRoutes(server);
};
