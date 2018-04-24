import React, { Component } from 'react';
import axios from 'axios';

const SpotifyWebApi = require('spotify-web-api-js');
const spotifyApi = new SpotifyWebApi();

class Access extends Component {
  constructor(){
    super();
    this.params = this.getHashParams();
    this.state = {
      access_token: this.params.access_token,
      refresh_token: this.params.refresh_token
    }
    if(this.params.access_token){
     spotifyApi.setAccessToken(this.params.access_token)
   }
  }

  componentDidMount(){
    if(this.params.access_token){
      spotifyApi.getMySavedTracks({
        limit : 10,
        offset: 0
      })
      .then(function(data) {
        console.log(data);
      }, function(err) {
        console.log('Something went wrong!', err);
      });}
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

  render() {
    console.log(this.state)
    return (
      <div>
        <div id="login">
          <a href="http://localhost:3100/users/spotifyLogin">Log in with Spotify</a>
        </div>
      </div>
    );
  }
}

export default Access;
