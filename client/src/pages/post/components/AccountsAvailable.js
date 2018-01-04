import React from 'react';
import styled from 'styled-components';

const Image = styled.img`
  width: 60px;
  height: 60px;
`;

const AccountsAvailable = (props) => {
  function dispatch (e) {
    e.preventDefault();
    props.dispatchUserCheckedAction(this.user);
  }
  return props.user.referedUsers.map((item, index) => {
    return (<div onClick={dispatch.bind({user: item.fbID})} key={index}
      style={{ border: '4px solid', marginRight: '50px', marginBottom: '10px', width: '100px', height: '120px',
        borderColor: props.post.usersMustPost.findIndex(mustpost =>
          mustpost === item.fbID) > -1 ? 'green' : 'red'}}>
      <Image
        style={{margin: '5px'}}
        src={item.avatar} />
        <h6> {item.name} </h6>
    </div>);
  });
};

export default AccountsAvailable;
