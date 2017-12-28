const FB = require('fb');
FB.options({version: 'v2.11'});

const getCurrentUser = (fbAccessToken) => {
  return new Promise((resolve, reject) => {   
   FB.api('me', { fields: 'id, name, email, picture',
                   scope: 'email', 
                   access_token: fbAccessToken }
    ).then(res => resolve(res))
    .catch(err => reject(err));
  });
};

module.exports = {
  getCurrentUser,
};
