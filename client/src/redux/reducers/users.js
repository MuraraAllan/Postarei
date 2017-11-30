export default (users = [], action) => {
  console.log(action)
  switch (action.type) {
    case 'GET_USERS':
      return action.payload;
    default:
      return users;
  }
}
