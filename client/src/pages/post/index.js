import React,{ Component } from 'react';
import UsersAvailable from './components/UsersAvailable';
import { connect } from 'react-redux';
import { getUser, setPostUser, setPostBody } from '../../redux/actions/';
import { Button } from 'reactstrap';

class PostContainer extends Component {
  submitPost (e) {
    e.preventDefault();
    console.log('hello');
  }
  render() {
    return (
      <div className='PostContainer'>
        <UsersAvailable post={this.props.post}
          dispatchUserCheckedAction={this.props.setPostUser}
          dispatchBodyAction={this.props.setPostBody}
          user={this.props.user} />
        <Button color="primary" style={{height: '100px', width: '100px'}} onClick={this.submitPost} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post,
  };
};

export default connect(mapStateToProps, { getUser, setPostBody, setPostUser })(PostContainer);
