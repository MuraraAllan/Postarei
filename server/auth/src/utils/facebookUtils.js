const FB = require('fb');
FB.options({version: 'v2.11'});

const getCurrentUser = (fbAccessToken) => {
  return new Promise((resolve, reject) => {   
   FB.api('me', { 
     fields: 'id, name, email, picture, feed',
     scope: 'email', 
     access_token: fbAccessToken }
   ).then(res => resolve(res))
    .catch(err => reject(err));
  });
};

const uploadImages = (fbAccessToken, images) => {
  const imagesPromise = [];
  images.forEach(image => {
    imagesPromise.push( new Promise(imagesPromise => {
      FB.api('/me/photos', 'post', {
        access_token: fbAccessToken,
        url: image, 
        published: false
      }).then(res => imagesPromise(res))
        .catch(err => imagesPromise(err));
    }));
  });
  return imagesPromise
};

const postFeed = (post, postUser) => {
  if ( post.images ) {
    const imagesPromise = uploadImages(post.access_token, post.images);
    return new Promise(resolve => {
      Promise.all(imagesPromise).then(result => {
        post.attached_media = [];
        result.forEach((image, index) => {
          post.attached_media[index] = { media_fbid: image.id};
        });
        console.log('POSTING NOW: ', post);
        FB.api('/me/feed', 'post', post)
          .then(res => resolve({...res, user: postUser}))
          .catch(err => resolve({...err, user: postUser}));
      }).catch(result => console.log(result))
    });
  } else {
    return new Promise(resolve => {
      FB.api('/me/feed','post', post)
        .then(res => resolve({...res, user: postUser}))
        .catch(err => resolve({...err, user: postUser}));
    });
  }
};

module.exports = {
  getCurrentUser,
  uploadImages,
  postFeed,
};
