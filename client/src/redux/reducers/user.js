export default (user = {}, action) => {
  switch (action.type) {
    case 'GET_USER':
      return {...user, user: action.payload };
    case 'LOGOUT' :
      return { ...user, error: action.payload };
    default:
      return user;
  }
}
