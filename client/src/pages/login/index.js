import React, { Component } from 'react';
import LoginComponent from './components/Login';

export default class LoginContainer extends Component {
  componentDidMount() {
    console.log('give me props_logincontainer', this.props);
  }

  render() {
    return (
      <div className='LoginContainer'>
        <LoginComponent />
      </div>
    )
  }
}
