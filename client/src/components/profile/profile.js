import React, { Component, Fragment } from 'react';
import Playlists from '../home/playlists';
import Search from '../home/search';
import New from '../home/new'

class Profile extends Component {
  constructor(){
    super();
    this.state = {
    }
  }

  renderSearch = () => (
    <Search
      users={this.props.allUsers}
      search={this.props.searchInput}
      thisUsername={this.props.thisUsername}
      changeProfile={this.props.changeProfile}
    />
  )

  renderPlaylists = () => (
    <Playlists
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
