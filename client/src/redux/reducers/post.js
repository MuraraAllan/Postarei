export default (post = { body: 'nothing at all', usersMustPost: [] }, action) => {
  switch (action.type) {
    case 'POST_BODY':
      return {...post, body: action.payload};
    case 'POST_USER':
      const index = post.usersMustPost.findIndex(item => item === action.payload);
      if (index > -1) {
        return {...post,
                usersMustPost: [ ...post.usersMustPost.slice(0, index),
                                 ...post.usersMustPost.slice(index+1)] }
      }
      return {...post, usersMustPost: [...post.usersMustPost, action.payload]}
    default:
      return post;
  }
}
