const FB = require('fb');
const { sendUserError, sendStatusOk, checkUserData } = require('./routeUtils');
const { facebookID, facebookRedirectUri, facebookSecret } = require('../secret.js');
FB.options({version: 'v2.11'});

const redirectToFacebookOauth = (req, res, next) => {
  if (req.session.redirect) {
    res.status(200);
    delete req.session.redirect;
    res.redirect('https://postarei.sloppy.zone/posting');
    return;
  }
  const authUrl = FB.getLoginUrl({
    scope: 'user_events, user_friends, user_about_me, email, user_status, user_posts, rsvp_event, publish_actions, user_managed_groups, manage_pages, publish_pages, pages_messaging, public_profile, basic_info',
    redirect_uri: facebookRedirectUri,
    appId: facebookID
  });
  res.redirect(authUrl);
  return;
}

const facebookOAuthCallback = (req, res, next) => {
  FB.api('oauth/access_token', {
      client_id: facebookID,
      scope: 'user_events, user_friends, user_about_me, email, user_status, user_posts, rsvp_event, publish_actions, user_managed_groups, manage_pages, publish_pages, pages_messaging, public_profile, basic_info',
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
