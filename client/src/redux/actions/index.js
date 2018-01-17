const axios = require('axios');
const ROOT_URL = 'https://postareioauth.herokuapp.com';

// const mockUsers = [
//   { uuid: 'abc214', name: 'Allan Murara', avatar_url: 'https://avatars2.githubusercontent.com/u/8569238?s=400&u=3cb618386ff047e98a56751add49d3391a891a55&v=4' },
//   { uuid: 'def356', name: 'Dummy Data', avatar_url: 'https://i.pinimg.com/736x/2e/fe/bd/2efebd60f3da34423e8ad8a92af16c2d--bob-sponge-spongebob-squarepants.jpg' },
//   { uuid: 'abc215', name: 'Allan Murara', avatar_url: 'https://avatars2.githubusercontent.com/u/8569238?s=400&u=3cb618386ff047e98a56751add49d3391a891a55&v=4' },
//   { uuid: 'def357', name: 'Dummy Data', avatar_url: 'https://i.pinimg.com/736x/2e/fe/bd/2efebd60f3da34423e8ad8a92af16c2d--bob-sponge-spongebob-squarepants.jpg' },
//   { uuid: 'abc218', name: 'Allan Murara', avatar_url: 'https://avatars2.githubusercontent.com/u/8569238?s=400&u=3cb618386ff047e98a56751add49d3391a891a55&v=4' },
//   { uuid: 'def359', name: 'Dummy Data', avatar_url: 'https://i.pinimg.com/736x/2e/fe/bd/2efebd60f3da34423e8ad8a92af16c2d--bob-sponge-spongebob-squarepants.jpg' }
// ];

export const submitPost = (post) => {
  return (dispatch) => {
    axios(`${ROOT_URL}/post`, { method: 'post', data: post,  withCredentials: true })
      .then((response) => {
        dispatch({
          type: 'POST_RESULT',
          payload: response.data
        })
      })
  };
};

export const newPost = () => {
  return {
    type: 'POST_RESET',
  }
};

export const getUser = () => {
  return (dispatch) => {
    axios(`${ROOT_URL}/user`, { method: 'get', withCredentials: true })
      .then((response)=> {
        dispatch({
          type: 'GET_USER',
          payload: response.data
        });
      })
      .catch(() => {
        dispatch({
          type: 'GET_USER',
          payload: { name: 'dummy', authenticated: false }
        });
      });
  };
};

export const setPostBody = (payload) => {
  return {
    type: 'POST_BODY',
    payload
  };
};

// export const postOff = () => {
//   return {
//     type: 'POST_OFF'
//   }
// }
export const postOff = () => { return { type: 'POST_OFF'} };
export const postOn = () => { return { type: 'POST_ON'} };

export const setImage = (payload) => {
  return {
    type: 'SET_IMAGE',
    payload
  }
};

export const setPostUser = (payload) => {
  return {
    type: 'POST_USER',
    payload
  };
};
export const selectAllUsersToPost = (payload) => {
  return {
    type: 'ALL_USERS_POST',
    payload
  }
};
export const logOutUser = (err) => {
  return {
    type: 'LOGOUT',
    payload: err
  };
};
