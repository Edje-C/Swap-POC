import React, { Component } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import Login from './auth/login.js'
import Register from './auth/register.js'
import Profile from './profile.js'
import Access from './auth/getAccess';

class App extends Component {
  render() {
    console.log(this.state)
    return (
      <div>
        <Route exact path="/" component={Profile} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/access" component={Access}/>
      </div>
    );
  }
}

export default App;
