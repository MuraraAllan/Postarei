import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { getUser, setPostUser, setPostBody, submitPost } from '../../redux/actions/';
import { Button } from 'reactstrap';
import NewPost from './components/NewPost'
import AccountsAvailable from './components/AccountsAvailable';

import './Post.css';

class PostContainer extends Component {
  clickButton (e) {
    e.preventDefault();
    const hasLength = this.props.post.usersMustPost.length > 0;
    if (hasLength) this.props.submitPost(this.props.post);
  }
  render() {
    return (
      <div className='PostContainer'>
        <div className='users-flex-container'>
          <AccountsAvailable
            dispatchUserCheckedAction={this.props.setPostUser}
            post={this.props.post}
            user={this.props.user}/>
        </div>
        <div className='body-flex-container'>
          <NewPost post={this.props.post}
            dispatchBodyAction={this.props.setPostBody}/>
        </div>
        <div className='button-flex-container'>
          <Button color="primary"
            onClick={this.clickButton.bind(this)} >
            Postar
          </Button>
        </div>
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

export default connect(mapStateToProps, { getUser, setPostBody, setPostUser, submitPost })(PostContainer);
