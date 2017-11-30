import React, { Component } from 'react';
import logo from './logo.svg';
import Login from './pages/login/';
import Post from './pages/post/';
import { Switch, Route } from 'react-router';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path='/posting' component={Post} />
          <Route component={Login}/>
        </Switch>
      </div>
    );
  }
}

export default App;
