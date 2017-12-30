import React from 'react';
import styled from 'styled-components';
import NewPost from './NewPost'

const UserWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  flex: 2 0 auto;
`;

const PostWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  flex: 5 0 auto;
`;

const EmptyWrapper = styled.div`
  display: flex;
  flex: 2 0 auto;
  flex-flow: column wrap;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
`

const UsersAvailable = (props) => {
  return (
      <EmptyWrapper >
        <UserWrapper className='UsersAvailableComponent'>
          {props.user.referedUsers.map((item, index) => <Image style={{margin: '5px'}} key={index} src={item.avatar} />)}
        </UserWrapper>
        <PostWrapper>
          <NewPost />
        </PostWrapper>
      </EmptyWrapper>
  )
}

export default UsersAvailable;
//
//
