import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { getUser, setPostUser, setPostBody, submitPost, postOff, postOn, setImage, newPost } from '../../redux/actions/';
import { Button } from 'reactstrap';
import NewPost from './components/NewPost';
import AccountsAvailable from './components/AccountsAvailable';

import './Post.css';

class PostContainer extends Component {
  uploadWidget() {
    this.props.postOff();
    window.cloudinary.openUploadWidget({
      cloud_name: 'muraraallan',
      upload_preset: 'lt8lw0j3',
      tags:['xmas']
    },(error, result) => {
      this.props.postOn();
      if (result) this.props.setImage(result.map(item => item.url))
    });
  }
  clickButton (e) {
    e.preventDefault();
    const hasLength = this.props.post.usersMustPost.length > 0;
    if (this.props.post.freeze) {
      alert('aguarde, existe uma publicação em andamento!');
      return;
    }
    if (hasLength) {
      this.props.submitPost(this.props.post);
      this.props.postOff();
    }
  }
  newPost (e) {
    e.preventDefault();
    this.props.newPost();
  }

  render() {
    console.log('RESULT:', this.props.post)
    console.log('USER :', this.props.user)
    return (
      <div className='PostContainer'>
        <div className='users-flex-container'>
          <AccountsAvailable
            dispatchUserCheckedAction={this.props.setPostUser}
            post={this.props.post}
            user={this.props.user}/>
            </div>
        <h4> {`http://postareioauth.sloppy.zone/join/${this.props.user.id}`} </h4>
         {this.props.post.result &&
          <div>
            <h4> Sucesso : </h4>
            { this.props.post.result.success.map((currentResult,index) => { return ( <div key={index}> <h4> {currentResult} </h4> <br /> </div> ) }) }
            <h4> Erro : </h4>
            <Button onClick={this.newPost.bind(this)} >
            { this.props.post.result.errors.map((currentResult,index) => { return ( <div key={index}> <h8> {currentResult.user} {currentResult.message} </h8> <br /> </div> ) }) }
              Nova postagem
            </Button>
          </div>}
        <div className='body-flex-container'>
          <NewPost post={this.props.post}
            dispatchBodyAction={this.props.setPostBody}/>
        </div>
        <div className='button-flex-container'>
          <Button color="primary"
            style={{visibility: this.props.post.freeze ? 'none' : 'visible'}}
            onClick={this.clickButton.bind(this)} >
            Postar
          </Button>
          <Button onClick={this.uploadWidget.bind(this)} className="upload-button">
              Adicionar Imagem a postagem
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

export default connect(mapStateToProps, { getUser, setPostBody, setPostUser, submitPost, postOff, postOn, setImage, newPost })(PostContainer);
