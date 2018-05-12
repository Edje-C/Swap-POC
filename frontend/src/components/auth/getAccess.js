import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const SpotifyWebApi = require('spotify-web-api-js');
const spotifyApi = new SpotifyWebApi();

class Access extends Component {
  constructor(){
    super();
  }

  componentDidMount(){
//
//       spotifyApi.getMySavedTracks({
//         limit : 10,
//         offset: 0
//       })
//       .then(function(data) {
//         console.log('My saved tracks', data);
//       }, function(err) {
//         console.log('Something went wrong!', err);
//       })
// ///////////////
//       spotifyApi.getTrack('34xTFwjPQ1dC6uJmleno7x')
//       .then(function(data) {
//         console.log('Get single track', data);
//       }, function(err) {
//         console.log('Something went wrong!', err);
//       });
// ///////////////
//       spotifyApi.getMe()
//       .then(function(data) {
//         console.log('Get Me', data);
//       }, function(err) {
//         console.log('Something went wrong!', err);
//       });
// //////////////
//       spotifyApi.getMyTopTracks({
//         limit: 5
//       })
//       .then(function(data) {
//           console.log('Get my top tracks', data);
//           let ids = data.items.map(v => v.id)
//           spotifyApi.getRecommendations({
//             limit: 50,
//             seed_tracks: ids
//           })
//           .then(function(data) {
//             console.log('Get Recommendations', data);
//           }, function(err) {
//             console.log('Something went wrong!', err);
//           });
//       }, function(err) {
//         console.log('Something went wrong!', err);
//       });
//
  this.getHashParams()
  }

  getHashParams = () => {
    const hashParams = {};
    let e;
    const r = /([^&;=]+)=?([^&;]*)/g;
    const q = window.location.hash.substring(1);

    while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }

    console.log('haqshpars', hashParams, this.props)
    this.props.saveTokens(hashParams)
  }

  render() {
    return (
      this.props.access_token ?
        <Redirect to="/" /> :
        <div> hi </div>
    );
  }
}
export default Access;
