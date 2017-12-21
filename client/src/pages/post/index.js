import React,  { Component } from 'react';
import UsersAvailable from './components/UsersAvailable';
import { connect } from 'react-redux';
import { getUser } from '../../redux/actions/';


class PostContainer extends Component {
  componentWillMount() {
    this.props.getUser();
  }
  render() {
    console.log('hello motoooo', this.props.user)
    const UsersAvailableWrapped = UsersAvailable;
    return (
      <div className='PostContainer'>
        <UsersAvailableWrapped  users={this.props.user}/>
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
