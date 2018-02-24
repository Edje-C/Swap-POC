import React, { Component } from 'react';
const SpotifyWebApi = require('spotify-web-api-js');
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    this.params = this.getHashParams();
    this.state = {
      loggedIn: this.params.access_token ? true : false
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
    console.log(this.state.loggedIn)
    return (
      <div className="App">
        <a href="http://localhost:8888"><button>login with spotify</button></a>
      </div>
    );
  }
}

export default App;
