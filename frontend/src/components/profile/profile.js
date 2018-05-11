import React, { Component, Fragment } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import Playlists from '../home/playlists';
import Search from '../home/search';
import axios from 'axios';

class Profile extends Component {
  constructor(){
    super();
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
    <Playlists thisUsername={this.props.thisUsername} profileUsername={this.props.profileUsername} playlists={this.props.usersPlaylists} />
  )

  render(){
    console.log('profile', this.state, this.props)
    return (
      <Fragment>
        <div id="content">
          <input type="text" onChange={this.props.handleInput} value={this.props.searchInput}/>
          {this.props.searchInput ?
            this.renderSearch():
            this.renderPlaylists()
          }
        </div>
        <div id="new-swap">
          <button>+</button>
        </div>
      </Fragment>
    );
  }
}

export default Profile;
