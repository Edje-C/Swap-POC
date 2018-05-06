import React, { Component } from 'react';
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
      <div id="profile">
        <div id="profile-data">
          <div className="logo">
            <Link to={`/users/${this.props.thisUsername}`}  data-username={this.props.thisUsername} onClick={this.props.changeProfile}>
              <h1 data-username={this.props.thisUsername} >S</h1>
              <p data-username={this.props.thisUsername} >Swap</p>
            </Link>
          </div>
          <h2>{this.props.profileUsername}</h2>
          <h3>{`# Friends`}</h3>
          {this.props.profileUsername ? <h3><button onClick={this.props.logout}>logout</button></h3>: <Link to="/login">login</Link>}
        </div>
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
      </div>
    );
  }
}

export default Profile;
