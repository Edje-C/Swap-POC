import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import modules from './modules'
import '../../CSS/playlists.css'

const Playlists = props => {
  // console.log(props)
  const acceptCollab = e => {
    let playlistID = e.target.dataset.id
    axios
      .get(`/users/getPlaylist/${playlistID}`)
      .then(res => {
        console.log('resGET' ,res.data)
        modules.getSongs(props.spotifyApi, (res.data.length).toString(), Number(res.data.collaborators))
          .then(data => {
            if(!data[0] || !data) {
              return
            }
            console.log('DATA' ,data)
            let neededData = data.map(v => {
              return {
                trackURI: v.id,
                name: v.name.replace(/(')/g, "''"),
                duration: modules.getDuration(v.duration_ms),
                artists: v.artists.map(v => v.name).join(', ').replace(/(')/g, "''"),
                album: v.album.name.replace(/(')/g, "''")
              }
            })

            console.log('neededDataPlay', neededData)
            axios
            .post('/users/saveTracks', {
              playlistID: playlistID,
              tracks: neededData
            })
            .then(data => {
              axios
              .patch('/users/acceptCollaboration', {
                playlistID,
                username: props.thisUsername,
              })
              .then(res => {
                updatePlaylist(playlistID)
              })
              .catch(err => {console.log(err)})
            })
            .catch(err => {
              console.log('err', err)
            })
          })
          .catch(err => {console.log('Something went wrong!', err)});
        })
        .catch(err => {console.log('Something went wrong!', err)})

  }

  const declineCollab = e => {
    axios
      .patch('/users/declineCollaboration', {
        playlistID: e.target.dataset.id,
        username: props.thisUsername,
      })
      .then(res => {
        updatePlaylist(e.target.dataset.id)
      })
      .catch(err => {console.log(err)})
  }

  const updatePlaylist = playlistID => {
    axios
      .get(`/users/getPlaylistStatus/${playlistID}`)
      .then(res => {
        console.log('playlsit status', res.data)
        if(res.data.filter(v => v.status === 'p').length) {
          props.getPlaylists(props.thisUsername)
        } else {
          axios
            .patch('/users/setAsComplete', {playlistID})
            .then(res => {
              props.getPlaylists(props.thisUsername)
            })
            .catch(err => {console.log(err)})
        }
      })
      .catch(err => {console.log(err)})
  }

  const saveToSpotify = e => {
    console.log('save')
    e.persist()
    let playlistID = e.target.dataset.id
    axios
      .get(`/users/getTracks/${playlistID}`)
      .then(res => {
        console.log('hbrefd', res.data, e.target.dataset.name)
        let allUris = res.data.map(v => `spotify:track:${v.track_uri}`)
        console.log(allUris)
        props.spotifyApi.createPlaylist(props.thisUserSpotifyID, {
          name: e.target.dataset.name,
          public: false
        })
          .then(data => {
            console.log(data)
            let ownerID = data.owner.id, playlistURI = data.id
            let i = 1
            while(i<=Math.ceil(allUris.length/100)) {
              let uris = allUris.slice(100*(i-1), 100*(i))
              props.spotifyApi.addTracksToPlaylist(ownerID, playlistURI, uris)
              i++
            }

            axios
              .patch('/users/saveURI', {playlistID, playlistURI })
              .then(res => {
                console.log(res.data)
                props.getPlaylists(props.thisUsername)
              })
              .catch(err => {console.log(err)})

            props.spotifyApi.changePlaylistDetails((ownerID), (playlistURI), {
              collaborative: true
            })
          })
          .catch(err => {console.log(err)})
      })
      .catch(err => {console.log(err)})
  }

  return (
    <div id="playlists">
      {
        props.playlists[0] ?
          props.playlists.map(v => (
            <div className="playlist">
              <div className="playlist-name-info">
                {v.uri ? <a className="playlist-link" href={`http://open.spotify.com/user/${v.spotify_id}/playlist/${v.uri}`} target="_blank">{v.name}<i class="material-icons green">call_made</i></a>: <p>{v.name}</p>}
              </div>
              <div className="playlist-status">
                {
                  v.uri ?
                    <p className="white">{v.date_created.substr(0, 10)}</p>:
                    props.profileUsername === props.thisUsername ?
                      v.complete ?
                        v.creator_id === props.thisUserID ?
                          <button className="save" data-id={v.id} data-name={v.name} onClick={saveToSpotify}>Save To Spotify<i class="material-icons blue">arrow_downward</i></button> :
                          <p>Ready To Save</p>:
                        v.status === 'p' ?
                          <Fragment>
                            <button className="accept green"><i class="material-icons" data-id={v.id} onClick={acceptCollab}>add</i></button>
                            <button  className="decline white"><i class="material-icons" data-id={v.id} onClick={declineCollab}>clear</i></button>
                          </Fragment>:
                          <p className="pending">Pending</p>:
                      v.complete ?
                        <p className="white">{v.date_created.substr(0, 10)}</p>:
                        <p className="white">Pending</p>

                }
              </div>
            </div>)):
        <div>
          <h1>{props.profileUsername === props.thisUsername ? 'You currently have no Swaps.' : 'This user currently has no Swaps.'}</h1>
          <p>Create your first Swap!</p>
        </div>
      }
    </div>
  );
}

export default Playlists;
