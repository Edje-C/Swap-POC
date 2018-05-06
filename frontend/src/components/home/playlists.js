import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';

const Playlists = props => {
  console.log('playlists', props)
  return (
    <div id="playlists">
      {
        props.playlists[0] ?
          props.playlists.map(v => (
            <div className="playlist">
              <p>{v.name}</p>
              {
                props.profileUsername === props.thisUsername && v.accepted_status === 'p'?
                <Fragment>
                <button>Accept</button>
                <button>Decline</button></Fragment>:
                <p>{v.accepted_status === 'p'? 'Pending' : v.date_created}</p>
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
