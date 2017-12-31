import React from 'react';
import styled from 'styled-components';

const Image = styled.img`
  width: 100px;
  height: 100px;
`;

const AccountsAvailable = (props) => {
  function dispatch (e) {
    e.preventDefault();
    props.dispatchUserCheckedAction(this.user);
  }
  return props.user.referedUsers.map((item, index) => {
    return (<div key={index}
      style={{ border: '4px solid',
        borderColor: props.post.usersMustPost.findIndex(mustpost =>
          mustpost === item.fbID) > -1 ? 'green' : 'red'}}>
      <Image onClick={dispatch.bind({user: item.fbID})}
        style={{margin: '5px'}}
        src={item.avatar} />
    </div>);
  });
};

export default AccountsAvailable;
