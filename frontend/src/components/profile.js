import React, { Component } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import '../CSS/profile.css';

class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: props.profileUsername,
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

    axios
      .get('/users/getUser')
      .then(res => {
        this.setState({thisUsername: res.data.user.username})
      })
  }

  handleInput = e => {
    console.log(e.target.value)
    this.setState({
      searchInput: e.target.value
    })
  }

  render() {
    console.log('profile', this.state, 'props', this.props.profileUsername)
    return (
      <div id="profile">
        <div id="profile-data">
          <div className="logo">
            <h1>S</h1>
            <p>Swap</p>
          </div>
          <h2>{this.props.profileUsername}</h2>
          <h3>{`# Friends`}</h3>
          {this.props.profileUsername ? <h3><button onClick={this.props.logout}>logout</button></h3>: <Link to="/login">login</Link>}
        </div>
        <div id="playlist-data">
          <input type="text" onChange={this.handleInput} value={this.state.searchInput}/>
          {
            this.state.searchInput ?
              this.allUsers.filter(v => v.username.includes(this.state.searchInput)).map(v=><Link to={`/users/${v.username}`}>{v.username}</Link>):
              this.state.usersPlaylist[0] ?
                this.state.usersPlaylist.map(v => (
                  <div>
                    <a href={``}>{v.name}</a>{/*/users/:username/playlist/:playlistID*/}
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
