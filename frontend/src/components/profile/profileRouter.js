import React, { Component, Fragment } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import Profile from './profile'
import '../../CSS/profile.css';
import Button from '@material-ui/core/Button';

const SpotifyWebApi = require('spotify-web-api-js');
const spotifyApi = new SpotifyWebApi();

class ProfileRouter extends Component {
  constructor(props){
    super(props);
    this.state = {
      profileUsername: '',
      usersPlaylists: [],
      searchInput: '',
      new: false,
      allUsers: [],
      access_token: this.props.access_token
    }
  }

  componentDidMount(){

    this.initializeState(this.props)

    axios
      .get('/users/getAllUsers')
      .then(res => {
        // console.log('all users', res.data)
        this.setState({allUsers: res.data.user})
      });
  }

  componentWillReceiveProps(nextprops){
    console.log('nextprops', nextprops)
    this.initializeState(nextprops)
  }

  initializeState = props => {

    this.setState({
      thisUsername: props.thisUsername,
      profileUsername: props.profileUsername
    })

    this.getPlaylists(props.profileUsername)

    // spotifyApi.getUserPlaylists("alittleify").then(function(data){console.log('get user playlist', data)})

    // spotifyApi.getMyTopTracks({
    //   limit: 5
    // })
    // .then(function(data) {
    //     console.log('Get my top tracks', data);
    //     let ids = data.items.map(v => v.id)
    //     spotifyApi.getRecommendations({
    //       limit: 50,
    //       seed_tracks: ids
    //     })
    //     .then(function(data) {
    //       console.log('Get Recommendations', data);
    //     }, function(err) {
    //       console.log('Something went wrong!', err);
    //     });
    // }, function(err) {
    //   console.log('Something went wrong!', err);
    // });
  }

  handleInput = e => {
    this.setState({
      searchInput: e.target.value
    })
  }

  getPlaylists = (username) => {
    axios
      .get(`/users/getPlaylists/${username}`)
      .then(res => {
        console.log('setting plasylsits', res.data)
        this.setState({usersPlaylists: res.data})
      })
      .catch(err => {console.log(err)})
  }

  changeProfile = e => {
    let username = e.target.dataset.username
    this.setState({profileUsername: username})
    axios
      .get(`/users/getUser/${username}`)
      .then(res => {
        console.log('get user', res.data)
        // this.renderProfile(props)
        this.getPlaylists(username)
        this.setState({searchInput: ''})
      })
  }

  toggleNew = e => {
    this.setState({
      new: !this.state.new
    })
    this.getPlaylists(this.props.profileUsername)
  }

  renderProfile = (props) => {
    return this.props.thisUsername ?
      (this.props.access_token || (this.props.thisUsername !== this.state.profileUsername) ?
      (
        <Profile
          thisUserID={this.props.thisUserID}
          thisUsername={this.props.thisUsername}
          thisUserSpotifyID={this.props.thisUserSpotifyID}
          profileUsername={this.state.profileUsername}
          changeProfile={this.changeProfile}
          logout={this.props.logout}
          handleInput={this.handleInput}
          new={this.state.new}
          searchInput={this.state.searchInput}
          allUsers={this.state.allUsers}
          changeProfile={this.changeProfile}
          usersPlaylists={this.state.usersPlaylists}
          spotifyApi={this.props.spotifyApi}
          getPlaylists={this.getPlaylists}
          toggleNew={this.toggleNew}
        />
      ) :
      window.location = "http://localhost:3100/users/spotifyLogin") :
      <div>Loading</div>
  }

  render() {
    // console.log('PR', this.state, this.props)
    return (
      <div  id="profile">
        <div id="profile-data">
          <div className="logo">
            <Link to={`/users/${this.props.thisUsername}`}  data-username={this.props.thisUsername} onClick={this.props.changeProfile, ()=>{this.setState({new: false})} }>
              <h1 data-username={this.props.thisUsername} >S</h1>
              <p data-username={this.props.thisUsername} >Swap</p>
            </Link>
          </div>
          <h2>{this.props.profileUsername}</h2>
          <h3>{`# Friends`}</h3>
          <h3><button onClick={this.props.logout}>logout</button></h3>
        </div>
        <div id="content">
          <Route path = {`/users/:username`} render={this.renderProfile}/>
        </div>
        <div id="new-swap">
          <Button variant="fab" onClick={this.toggleNew} id="new-button">
            {this.state.new ? <i class="material-icons">close</i>: <i class="material-icons">add</i>}
          </Button>
        </div>
      </div>
    )
  }
}

export default ProfileRouter;
