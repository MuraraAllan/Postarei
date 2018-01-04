import React, { Component } from 'react';
import LoginComponent from './components/Login';
import { connect } from 'react-redux';
import { getUser } from '../../redux/actions/';
import Post from '../post/';

class LoginContainer extends Component {
  render() {
    return (
      <div className='LoginContainer'>
        {this.props.user.authenticated ? <Post/> : <LoginComponent /> }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { getUser })(LoginContainer);
