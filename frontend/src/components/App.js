import React, { Component } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import Login from './auth/login.js'
import Register from './auth/register.js'
import Profile from './profile.js'
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
      access_token: this.params.access_token,
      refresh_token: this.params.refresh_token
    }
    if(this.params.access_token){
     spotifyApi.setAccessToken(this.params.access_token)
    }
  }

  componentDidMount(){
    axios
      .get('/users/getCurrentUser')
      .then(res => {
        this.setState({
          thisUsername: res.data.user.username,
          profileUsername: res.data.user.username
        })
      })
      .catch(err => <Login />)

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

  renderProfile = (props) => {
    return this.state.access_token?
      <Profile
        thisUsername={this.state.thisUsername}
        logout={this.logoutUser}
        spotifyApi={spotifyApi}
        profileUsername={props.match.params.username}
      /> :
      window.location = 'http://localhost:3100/users/spotifyLogin'
  }

  renderLogin = () => (this.state.thisUsername?
    <Redirect to={`/users/${this.state.thisUsername}`} />:
    <Redirect to="/login" />
  )


  renderRegister = () => (
    this.state.thisUsername?
      <Redirect to={`/users/${this.state.thisUsername}`} />:
      <Redirect to="/register" />
  )

  redirectToProfile = () => (
    this.state.thisUsername?
      <Redirect to={`/users/${this.state.thisUsername}`} />:
      <Redirect to="/login" />
  )

  render() {
    return (
      <div>
        <Route path="/users/:username" render={this.renderProfile} />
        <Route path="/login" render={this.renderLogin} />
        <Route path="/register" render={this.renderRegister} />
        <Route path="/access" component={Access}/>
        <Route path="/" render={this.redirectToProfile}/>
      </div>
    );
  }
}

export default App;
