import React, { Component, Fragment } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import Playlists from '../home/playlists';
import Search from '../home/search';
import New from '../home/new'
import axios from 'axios';

class Profile extends Component {
  constructor(){
    super();
    this.state = {
    }
  }

  renderSearch = () => {
    let {thisUsername, profileUsername, searchInput, allUsers, changeProfile, getPlaylists} = this.props
    return (
      <Search
        users={allUsers}
        search={this.props.searchInput}
        thisUsername={thisUsername}
        changeProfile={changeProfile}
      />
    )
  }

  renderPlaylists = () => (
    <Playlists
      thisUserID={this.props.thisUserID}
      thisUsername={this.props.thisUsername}
      thisUserSpotifyID={this.props.thisUserSpotifyID}
      profileUsername={this.props.profileUsername}
      playlists={this.props.usersPlaylists}
      getPlaylists={this.props.getPlaylists}
      spotifyApi={this.props.spotifyApi}
      triggerErrorModal={this.props.triggerErrorModal}
    />
  )


  renderNew = () => (
    <New
      thisUsername={this.props.thisUsername}
      users={this.props.allUsers}
      spotifyApi={this.props.spotifyApi}
      toggleNew={this.props.toggleNew}
      triggerErrorModal={this.props.triggerErrorModal}
    />
  )


  render(){
    console.log('profile', this.props)
    return (
      this.props.new ?
        this.renderNew():
        <Fragment>
          <div id="home">
            <div id="search-field">
              <input type="text" id="search-user" onChange={this.props.handleInput} value={this.props.searchInput} placeholder="Search For Friends"/>
              <div id="search-icon"><i class="material-icons">search</i></div>
            </div>
            {this.props.searchInput ?
              this.renderSearch():
              this.renderPlaylists()
            }
          </div>
        </Fragment>
    );
  }
}

export default Profile;
