import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
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
    axios
      .get('/users/getCurrentUser')
      .then(res => console.log('USER', res.data))
      .catch(err => console.log(err))

    if(this.params.access_token){

      spotifyApi.getMySavedTracks({
        limit : 10,
        offset: 0
      })
      .then(function(data) {
        console.log('My saved tracks', data);
      }, function(err) {
        console.log('Something went wrong!', err);
      })
///////////////
      spotifyApi.getTrack('34xTFwjPQ1dC6uJmleno7x')
      .then(function(data) {
        console.log('Get single track', data);
      }, function(err) {
        console.log('Something went wrong!', err);
      });
///////////////
      spotifyApi.getMe()
      .then(function(data) {
        console.log('Get Me', data);
      }, function(err) {
        console.log('Something went wrong!', err);
      });
//////////////
      spotifyApi.getMyTopTracks({
        limit: 5
      })
      .then(function(data) {
          console.log('Get my top tracks', data);
          let ids = data.items.map(v => v.id)
          spotifyApi.getRecommendations({
            limit: 50,
            seed_tracks: ids
          })
          .then(function(data) {
            console.log('Get Recommendations', data);
          }, function(err) {
            console.log('Something went wrong!', err);
          });
      }, function(err) {
        console.log('Something went wrong!', err);
      });

    }
  }

/**
 * @return {string} returns the access_token and refresh_token
 */
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
      <Redirect to="/" />
    );
  }
}
export default Access;
