import React, { Component } from 'react';
import Login from './pages/login/';
import Post from './pages/post/';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import { connect } from 'react-redux';
import { getUser } from './redux/actions/';


class App extends Component {
  constructor(props) {
    super(props);
    this.props.getUser();
  }
  render() {
    return (
      <div className="App">
        <Route path='/' component={Login}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps, { getUser })(App);
