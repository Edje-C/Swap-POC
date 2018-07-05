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
    this.state = {
      thisUserID: 0,
      thisUsername: '',
      profileUsername: '',
      loggedUser: true,
      access_token: '',
      refresh_token: ''
    }
  }

  componentWillMount(){
    this.getUser()
  }

  getUser = () => {
    axios
      .get('/users/getThisUser')
      .then(res => {
        console.log('!!!!1' ,res.data)
        this.setState({
          thisUserID: res.data.user.id,
          thisUserSpotifyID: res.data.user.spotify_id,
          thisUsername: res.data.user.username,
          profileUsername: res.data.user.username,
          loggedUser: true
        })
        if(!res.data.user.spotify_id) {
          spotifyApi.getMe()
            .then(data => {
              axios
                .patch('/users/saveSpotifyID', {
                  userID: res.data.user.id,
                  spotifyID: data.id
                })
                .then(data => {
                  this.getUser()
                })
            })
        }
      })
      .catch(err => {this.setState({ loggedUser: false })} )
  }

  logoutUser = () => {
    axios
      .get('/users/logout')
      .then(res => {
        this.setState({
          thisUsername: '',
          loggedUser: false
        })
      })
  }

  saveTokens = (tokens) => {
    this.setState({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    })

    spotifyApi.setAccessToken(tokens.access_token)
  }

  renderProfile = (props) => (
    this.state.loggedUser ?
      <ProfileRouter
        thisUserID={this.state.thisUserID}
        thisUsername={this.state.thisUsername}
        thisUserSpotifyID={this.state.thisUserSpotifyID}
        profileUsername={props.match.params.username}
        access_token={this.state.access_token}
        spotifyApi={spotifyApi}
        logout={this.logoutUser}
        changeProfile={this.changeProfile}
        props={props}
      /> :
      <Redirect to="/login" />
  )

  renderLogin = (props) => (
    this.state.thisUsername ?
      <Redirect to={`/users/${this.state.thisUsername}`} /> :
      <Login getUser={this.getUser}/>
  )


  renderRegister = () => (
    this.state.thisUsername ?
      <Redirect to={`/users/${this.state.thisUsername}`} /> :
      <Register getUser={this.getUser}/>
  )

  redirectToProfile = () => (
    this.state.loggedUser ?
      <Redirect to={`/users/${this.state.thisUsername}`} /> :
      <Redirect to="/login" />
  )

  renderAccess = () => (
    <Access
      saveTokens={this.saveTokens}
      access_token={this.state.access_token}
    />
  )

  render() {
    // console.log(this.state)
    return (
      <div>
        <Route exact path="/" render={this.redirectToProfile}/>
        <Route exact path="/users" render={this.redirectToProfile}/>
        <Route path="/login" render={this.renderLogin} />
        <Route path="/register" render={this.renderRegister} />
        <Route path="/access" render={this.renderAccess}/>
        <Route path="/users/:username" render={this.renderProfile} />
      </div>
    );
  }
}

export default App;
