import React from 'react';
import NewPost from './NewPost'
import AccountsAvailable from './AccountsAvailable';
import styled from 'styled-components';
impot { Button '
const UsersWrapper = styled.div`
  display: flex;
  rgmaflex-flow: row wrap;
  flex: 2 0 auto;
`;

const NewPostWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  flex: 5 0 auto;
`;

const EmptyWrapper = styled.div`
  display: flex;
  flex: 2 0 auto;
  flex-flow: column wrap;
`;

const PostContainer = (props) => {
  return (
    <EmptyWrapper >
      <UsersWrapper>
        <AccountsAvailable dispatchUserCheckedAction={props.dispatchUserCheckedAction} 
          post={props.post}
          user={props.user}/>
      </UsersWrapper>
      <NewPostWrapper>
        <Button 
        <NewPost post={props.post} dispatchBodyAction={props.dispatchBodyAction}/>
      </NewPostWrapper>
    </EmptyWrapper>
  );
};
export default PostContainer;
