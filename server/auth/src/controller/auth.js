const User = require('../model/mongoose/user');
const { sendUserError, sendStatusOk, checkUserData } = require('./routeUtils');
const fbOauthUtils = require('./oauthUtils').facebook;
const fbUtils = require('../utils/facebookUtils');
const FB = require('fb');
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

const formatUser = user => Object.assign({}, { id: user.id }, { name: user.name }, { avatar: user.avatar }, { fbID: user.fbID });

const persistenceLayer = (req, res, next) => {
  const fbAccessToken = req.session.facebookAccessToken;
  const refererID = req.session.refererID;
  if (fbAccessToken) {
    fbUtils.getCurrentUser(fbAccessToken).then(fbUser => {
      const email = fbUser.email ? fbUser.email : fbUser.id.concat('@facebook.com');
      User.findOne({ email })
       .populate('referedUsers').
        exec((err,user) => {
          const fbUserPicture = fbUser.picture.data.url;
          if (!user) {
            user = new User({ 
              name: fbUser.name, 
              fbID: fbUser.id, 
              fbAccessToken, 
              email, 
              avatar: fbUserPicture, 
              fbProfilePicture: fbUserPicture
            });
          } else {
            user = Object.assign(user, {  name: fbUser.name, 
              fbID: fbUser.id, 
              fbAccessToken, 
              email, 
              avatar: fbUserPicture, 
              fbProfilePicture: fbUserPicture });
         }
          
         return  user.save((err) => {
            if (err) return sendUserError(res, err);
            if (refererID) { addReference(user._id, refererID); }
            req.session.user = user;
            return next();
          });
      })
    }).catch(err => next());
  } else {
    return fbOauthUtils.redirectToFacebookOauth(req, res, next);
  }
};


const currentUser = (req, res, next) => {
  const user = req.session.user;
  const returnUser = formatUser(user);
  returnUser.referedUsers = user.referedUsers.map(referenceUser => formatUser(referenceUser));
  returnUser.authenticated = true;
  sendStatusOk(res, returnUser);
  return;
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

const postRoute = (req, res, next) => {
  const user = req.session.user;
  const usersMustPost = req.body.usersMustPost;
  const postUsers = req.session.user.referedUsers.filter(referedUser => usersMustPost.indexOf(referedUser.fbID) > -1 ? usersMustPost : '');
  const promises = [];
  console.log(req.body)
  const images = req.body.images ? req.body.images : null;

  postUsers.forEach(postUser => {
    const post = {
      access_token: postUser.fbAccessToken,
      message: req.body.body 
    };
    if (req.body.images) post.images = req.body.images;
    promises.push(fbUtils.postFeed(post, postUser.name));
  });
  Promise.all(promises).then(promiseRes => {
    const result = {
      errors: [],
      success: [],
    };
    promiseRes.forEach(process => {
      const message = process.message ? JSON.parse(process.message) : {}; 
      if ( message.error ) { 
        const error = {
          user: process.user,
          message: message.error.error_user_msg
        };
        result.errors = [
           ...result.errors,  
          error 
        ];
      } else {
        result.success = [
          ...result.success, 
          process.user 
        ];
      }
    })
    sendStatusOk(res, result);
    return;
  }).catch(err=> console.log('errrrr', err));
}

module.exports = (server) => {
  server.get('/join/:recruiterID', recruitNewUser);
  server.get('/oauth/facebook', fbOauthUtils.redirectToFacebookOauth);
  server.get('/oauth/facebook/callback', fbOauthUtils.facebookOAuthCallback);
  server.use(persistenceLayer);
  server.get('/user', currentUser);
  server.post('/post', postRoute);
  server.use(fbOauthUtils.redirectToFacebookOauth);
};
