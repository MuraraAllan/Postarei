import React from 'react';
import styled from 'styled-components';
import NewPost from './NewPost'

const UserWrapper = styled.div`
  display: flex;
  rgmaflex-flow: row wrap;
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
  function dispatch (e) {
    e.preventDefault();
    props.dispatchUserCheckedAction(this.user);
  }
  return (
      <EmptyWrapper >
        <UserWrapper className='UsersAvailableComponent'>
          {props.user.referedUsers.map((item, index) => {
            return (<div key={index}
                         style={{ border: '4px solid',
                                  borderColor: props.post.usersMustPost.findIndex(mustpost =>
                                  mustpost === item) > -1 ? 'green' : 'red'}}>
                      <Image onClick={ dispatch.bind({user: item}) }
                               style={{margin: '5px'}}
                               src={item.avatar} />
            </div>)
          })}
        </UserWrapper>
        <PostWrapper>
          <NewPost post={props.post} dispatchBodyAction={props.dispatchBodyAction}/>
        </PostWrapper>
      </EmptyWrapper>
  )
}

export default UsersAvailable;
//
//
