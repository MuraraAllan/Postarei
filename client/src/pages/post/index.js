import React,  { Component } from 'react';
import UsersAvailable from './components/UsersAvailable';
import { connect } from 'react-redux';
import { getUser, setPostUser, setPostBody } from '../../redux/actions/';


class PostContainer extends Component {
  render() {
    const UsersAvailableWrapped = UsersAvailable;
    return (
      <div className='PostContainer'>
        <UsersAvailableWrapped post={this.props.post} dispatchUserCheckedAction={this.props.setPostUser} dispatchBodyAction={this.props.setPostBody} user={this.props.user}/>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post,
  }
}

export default connect(mapStateToProps, { getUser, setPostBody, setPostUser })(PostContainer);
