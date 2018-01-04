export default (post = { body: '', usersMustPost: [] }, action) => {
  switch (action.type) {
    case 'POST_BODY':
      return {...post, body: action.payload}
    case 'POST_USER':
      const index = post.usersMustPost.findIndex(item => item === action.payload);
      if (index > -1) {
        return {...post,
                usersMustPost: [ ...post.usersMustPost.slice(0, index),
                                 ...post.usersMustPost.slice(index+1)] }
      }
      return {...post, usersMustPost: [...post.usersMustPost, action.payload]}
    case 'POST_RESET':
      return { body: '', usersMustPost: [] }
    case 'SET_IMAGE':
      return { ...post, images: action.payload }
    case 'POST_RESULT':
      return { ...post, result: action.payload }
    case 'POST_OFF':
      return { ...post, freeze: true }
    case 'POST_ON':
      return { ...post, freeze: false }
    default:
      return post;
  }
};
