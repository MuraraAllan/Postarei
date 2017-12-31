const FB = require('fb');
const { sendUserError, sendStatusOk, checkUserData } = require('./routeUtils');
const { facebookID, facebookRedirectUri, facebookSecret } = require('../secret.js');
FB.options({version: 'v2.11'});

const redirectToFacebookOauth = (req, res, next) => {
  if (req.session.redirect) {
    res.status(200);
    delete req.session.redirect;
    res.redirect('http://localhost:3000/posting');
    return;
  }
  const authUrl = FB.getLoginUrl({
    scope: 'email, user_likes, user_photos, publish_actions, user_videos, public_profile, user_friends',
    redirect_uri: facebookRedirectUri,
    appId: facebookID
  });
  res.redirect(authUrl);
  return;
}

const facebookOAuthCallback = (req, res, next) => {
  FB.api('oauth/access_token', {
      client_id: facebookID,
      scope: 'email, user_likes, publish_actions, user_photos, user_videos, public_profile, user_friends',
      client_secret: facebookSecret, 
      redirect_uri: facebookRedirectUri,
      code: req.query.code
  }).then(facebookRes => {
    req.session.redirect = true;
    req.session.facebookAccessToken = facebookRes.access_token;
    next();
    return;
  }).catch(err => {
    sendUserError(res, JSON.parse(err.message).error.message);
    return;
  });
}

module.exports = {
 facebook: {
  redirectToFacebookOauth,
  facebookOAuthCallback 
 }
};
