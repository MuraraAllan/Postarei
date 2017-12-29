import React,  { Component } from 'react';
import UsersAvailable from './components/UsersAvailable';
import { connect } from 'react-redux';
import { getUser } from '../../redux/actions/';


class PostContainer extends Component {
  render() {
    const UsersAvailableWrapped = UsersAvailable;
    return (
      <div className='PostContainer'>
        <UsersAvailableWrapped user={this.props.user}/>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps, { getUser })(PostContainer);
