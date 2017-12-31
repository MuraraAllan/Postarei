import React,{ Component } from 'react';
import UsersAvailable from './components/UsersAvailable';
import { connect } from 'react-redux';
import { getUser, setPostUser, setPostBody, submitPost } from '../../redux/actions/';
import { Button } from 'reactstrap';

class PostContainer extends Component {
  clickButton (e) {
    e.preventDefault();
    const hasLength = this.props.post.usersMustPost.length > 0;
    if (hasLength) this.props.submitPost(this.props.post);
  }
  render() {
    return (
      <div className='PostContainer'>
        <UsersAvailable post={this.props.post}
          dispatchUserCheckedAction={this.props.setPostUser}
          dispatchBodyAction={this.props.setPostBody}
          user={this.props.user} />
          <Button style={{marginLeft: '-90%'}} color="primary" onClick={this.clickButton.bind(this)} > Postar  </Button>
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
