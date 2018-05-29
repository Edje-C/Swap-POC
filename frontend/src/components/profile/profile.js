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
      new : false
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
    <Playlists thisUsername={this.props.thisUsername} profileUsername={this.props.profileUsername} playlists={this.props.usersPlaylists} />
  )


  renderNew = () => (
    <New
      thisUsername={this.props.thisUsername}
      users={this.props.allUsers}
      spotifyApi={this.props.spotifyApi}
    />
  )


  render(){
    return (
      this.props.new ?
        this.renderNew():
        <Fragment>
          <div id="content">
            <input type="text" onChange={this.props.handleInput} value={this.props.searchInput}/>
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
