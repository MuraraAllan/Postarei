import React, { Component } from 'react';
import LoginComponent from './components/Login';

export default class LoginContainer extends Component {
  componentDidMount() {
    console.log('give me props ', this.props);
  }

  render() {
    return (
      <div class='LoginContainer'>
        <LoginComponent />
      </div>
    )
  }
}
