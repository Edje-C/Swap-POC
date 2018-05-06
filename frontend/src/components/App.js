import React, { Component } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import Login from './auth/login.js'
import Register from './auth/register.js'
import ProfileRouter from './profile/profileRouter.js'
import Access from './auth/getAccess';

const SpotifyWebApi = require('spotify-web-api-js');
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    this.params = this.getHashParams();
    this.state = {
      thisUsername: '',
      profileUsername: '',
      // access_token: this.params.access_token,
      // refresh_token: this.params.refresh_token
    }
    // if(this.params.access_token){
    //  spotifyApi.setAccessToken(this.params.access_token)
    // }
  }

  componentWillMount(){
    this.getUser()
  }

  getUser = () => {
    axios
      .get('/users/getThisUser')
      .then(res => {
        console.log(res.data.user)
        this.setState({
          thisUsername: res.data.user.username,
          profileUsername: res.data.user.username
        })
      })
      .catch(err => console.log('GET USER ERROR', err))
  }

  getHashParams = () => {
    const hashParams = {};
    let e;
    const r = /([^&;=]+)=?([^&;]*)/g;
    const q = window.location.hash.substring(1);

    while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
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

  renderProfile = (props) => (
    this.state.thisUsername ?
      <ProfileRouter
        thisUsername={this.state.thisUsername}
        logout={this.logoutUser}
        changeProfile={this.changeProfile}
        props={props}
      />:
      <Login getUser={this.getUser}/>
  )

  renderLogin = (props) => (
    this.state.thisUsername ?
      <Redirect to={`/users/${this.state.thisUsername}`} />:
      <Login getUser={this.getUser}/>
  )


  renderRegister = () => (
    this.state.thisUsername ?
      <Redirect to={`/users/${this.state.thisUsername}`} />:
      <Register getUser={this.getUser}/>
  )

  redirectToProfile = () => (
    this.state.thisUsername ?
      <Redirect to={"/users"} />:
      <Redirect to="/login" />
  )

  render() {
    console.log('App', this.state)
    return (
      <div>
        <Route path="/users/" render={this.renderProfile} />
        <Route path="/login" render={this.renderLogin} />
        <Route path="/register" render={this.renderRegister} />
        <Route path="/access" component={Access}/>
        <Route path="/" render={this.redirectToProfile}/>
      </div>
    );
  }
}

export default App;
