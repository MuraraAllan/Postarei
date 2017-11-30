const mockUsers = [
  { uuid: 'abc214', name: 'Allan Murara', avatar_url: 'https://avatars2.githubusercontent.com/u/8569238?s=400&u=3cb618386ff047e98a56751add49d3391a891a55&v=4' },
  { uuid: 'def356', name: 'Dummy Data', avatar_url: 'https://i.pinimg.com/736x/2e/fe/bd/2efebd60f3da34423e8ad8a92af16c2d--bob-sponge-spongebob-squarepants.jpg' },
  { uuid: 'abc215', name: 'Allan Murara', avatar_url: 'https://avatars2.githubusercontent.com/u/8569238?s=400&u=3cb618386ff047e98a56751add49d3391a891a55&v=4' },
  { uuid: 'def357', name: 'Dummy Data', avatar_url: 'https://i.pinimg.com/736x/2e/fe/bd/2efebd60f3da34423e8ad8a92af16c2d--bob-sponge-spongebob-squarepants.jpg' },
  { uuid: 'abc218', name: 'Allan Murara', avatar_url: 'https://avatars2.githubusercontent.com/u/8569238?s=400&u=3cb618386ff047e98a56751add49d3391a891a55&v=4' },
  { uuid: 'def359', name: 'Dummy Data', avatar_url: 'https://i.pinimg.com/736x/2e/fe/bd/2efebd60f3da34423e8ad8a92af16c2d--bob-sponge-spongebob-squarepants.jpg' }
];

export const getUsers = () => {
  return {
      type: 'GET_USERS',
      payload: mockUsers
  }
}
