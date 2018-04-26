import React, { Component } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import Login from './auth/login.js'
import Register from './auth/register.js'
import Profile from './profile.js'
import Access from './auth/getAccess';

class App extends Component {
  constructor(){
    super();
    this.state = {
      thisUsername: ''
    }
  }

  componentDidMount(){
    axios
      .get('/users/getCurrentUser')
      .then(res => {
        this.setState({thisUsername: res.data.user.username})
      })
  }

  logoutUser = () => {
    axios
      .get('/users/logout')
      .then(res => {
        this.setState({
          thisUsername: ''
        })
      })
  }

  renderProfile = () => (
    this.state.thisUsername ?
      <Profile
        thisUsername={this.state.thisUsername}
        logout={this.logoutUser}
      /> :
      <Redirect to="/login" />
  )

  renderLogin = () => (
    this.state.thisUsername ?
    <Redirect to="/" /> :
    <Login />
  )


  renderRegister = () => (
    this.state.thisUsername ?
      <Redirect to="/" /> :
      <Register />
  )


  render() {
    console.log('App', this.state)
    return (
      <div>
        <Route exact path="/" render={this.renderProfile} />
        <Route path="/login" render={this.renderLogin} />
        <Route path="/register" render={this.renderRegister} />
        <Route path="/access" component={Access}/>
      </div>
    );
  }
}

export default App;
