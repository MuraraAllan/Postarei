import React from 'react';
import styled from 'styled-components';


const UserWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const EmptyWrapper = styled.div`
  display: flex;
  flex: 1 0 auto;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
`

const UsersAvailable = (props) => {
  return (
      <EmptyWrapper >
        <UserWrapper className='UsersAvailableComponent'>
          <h1> hello moto {props.user.name} </h1>
        </UserWrapper>
      </EmptyWrapper>
  )
}

export default UsersAvailable;
//
// {props.users.map(item => {
//   return <Image style={{margin: '5px'}} key={item.uuid} src={item.avatar_url} />
// })}
