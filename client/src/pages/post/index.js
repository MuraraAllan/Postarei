import React,  { Component } from 'react';
import UsersAvailable from './components/UsersAvailable';
import { connect } from 'react-redux';
import { getUsers } from '../../redux/actions/';


class PostContainer extends Component {
  componentWillMount() {
    this.props.getUsers();
    console.log('give me props PostContainer', this.props)
  }

  render() {
    const UsersAvailableWrapped = UsersAvailable;
    console.log()
    return (
      <div className='PostContainer'>
        <UsersAvailableWrapped  users={this.props.users}/>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    users: state.users,
  }
}

export default connect(mapStateToProps, { getUsers })(PostContainer);
