import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import axios from 'axios';

// const SpotifyWebApi = require('spotify-web-api-js');
// const spotifyApi = new SpotifyWebApi();

class Profile extends Component {
  constructor(){
    super();
    this.state = {
      user: ''
    }
  }




  render() {
    console.log(this.state)
    return (
      <div>
        <div id="profile-data">
          <h1>Swap</h1>
          <h2>{`Username`}</h2>
          <h3>{`# Friends`}</h3>
          <h3><Link to="/access">access</Link></h3>
          {this.state.user ? <h3><button></button></h3>: <Link to="/login">login</Link>}
        </div>
        <div></div>
      </div>
    );
  }
}

export default Profile;
