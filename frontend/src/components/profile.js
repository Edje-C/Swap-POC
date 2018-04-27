import React, { Component } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import '../CSS/profile.css';

class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: props.thisUsername,
      usersPlaylist: [],
      searchInput: '',

    }
    this.allUsers = []
  }

  componentDidMount(){

    this.props.spotifyApi.getMe()
    .then(function(data) {
      console.log('Get Me!!!!!!!!!', data);
    }, function(err) {
      console.log('Something went wrong!', err);
    });

    axios
      .get('/users/getAllUsers')
      .then(res => {
        this.allUsers = res.data.user
      });

  }

  handleInput = e => {
    console.log(e.target.value)
    this.setState({
      searchInput: e.target.value
    })
  }

  render() {
    console.log('profile', this.state)
    return (
      <div id="profile">
        <div id="profile-data">
          <div className="logo">
            <h1>S</h1>
            <p>Swap</p>
          </div>
          <h2>{this.state.username}</h2>
          <h3>{`# Friends`}</h3>
          {this.state.username ? <h3><button onClick={this.props.logout}>logout</button></h3>: <Link to="/login">login</Link>}
        </div>
        <div id="playlist-data">
          <input type="text" onChange={this.handleInput} value={this.state.searchInput}/>
          {
            this.state.searchInput ?
              this.allUsers.filter(v => v.username.includes(this.state.searchInput)).map(v=><p>{v.username}</p>):
              this.state.usersPlaylist[0] ?
                this.state.usersPlaylist.map(v => (
                  <div>
                    <a href={``}>{v.name}</a>{/*/users/:username/:playlistID*/}
                    <p>{v.date}</p>
                  </div>
                )):
                <div>
                  <h1>You currently have no Swaps</h1>
                  <p>Create your first Swap!</p>
                </div>
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
