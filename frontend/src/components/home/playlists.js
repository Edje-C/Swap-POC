import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import modules from './modules'

const Playlists = props => {

  const acceptCollab = e => {
    let playlistID = e.target.dataset.id

    // modules.getSongs(this.props.spotifyApi, this.state.length, this.state.customLength, this.state.selectedFriends)
    //   .then(data => {
    //     let neededData = data.map(v => {
    //         return {
    //           trackURI: v.id,
    //           name: v.name.replace(/(')/g, "''"),
    //           duration: modules.getDuration(v.duration_ms),
    //           artists: v.artists.map(v => v.name).join(', ').replace(/(')/g, "''"),
    //           album: v.album.name.replace(/(')/g, "''")
    //         }
    //     })
    //
    //     console.log('neededData', neededData)
    //     axios
    //       .post('/users/saveTracks', {
    //         playlistID: playlistID,
    //         tracks: neededData
    //       })
    //       .then(data => {
            axios
              .patch('/users/acceptCollaboration', {
                playlistID,
                username: this.props.thisUsername
              })
              .then(res => {
                console.log('ADDED collaborations', res)
              })
              .catch(err => {console.log(err)})
      //      })
      //     .catch(err => {
      //       console.log('err', err)
      //     })
      // });
  }

  const declineCollab = e => {

  }

  console.log('playlists', props)
  return (
    <div id="playlists">
      {
        props.playlists[0] ?
          props.playlists.map(v => (
            <div className="playlist">
              <p>{v.name}</p>
              {
                props.profileUsername === props.thisUsername && v.status === 'p' ?
                  <Fragment>
                    <button data-id={v.id} onClick={acceptCollab}>Accept</button>
                    <button data-id={v.id} onClick={this.declineCollab}>Decline</button>
                  </Fragment>:
                  <p>{v.status === 'p' ? 'Pending' :  v.date_created}</p>
              }
            </div>)):
          <div>
            <h1>You currently have no Swaps</h1>
            <p>Create your first Swap!</p>
          </div>
      }
    </div>
  );
}

export default Playlists;
