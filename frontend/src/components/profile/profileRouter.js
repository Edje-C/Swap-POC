import React, { Component, Fragment } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/profile.css';
import Profile from './profile'

class ProfileRouter extends Component {
  constructor(props){
    super(props);
    this.state = {
      thisUsername: props.thisUsername,
      profileUsername:  props.thisUsername,
      usersPlaylists: [],
      searchInput: '',
      allUsers: []
    }
  }

  componentDidMount(){

        console.log('MOUNTING!!!!!!!')
    // this.props.spotifyApi.getMe()
    // .then(function(data) {
    //   console.log('Get Me!!!!!!!!!', data);
    // }, function(err) {
    //   console.log('Something went wrong!', err);
    // });
    //
    // this.props.spotifyApi.getMyTopTracks({
    //   limit: 5
    // })
    // .then(function(data) {
    //     console.log('Get my top tracks', data);
    //     let ids = data.items.map(v => v.id)
    //     this.props.spotifyApi.getRecommendations({
    //       limit: 50,
    //       seed_tracks: ids
    //     })
    //     .then(function(data) {
    //       console.log('Get Recommendations', data);
    //     }, function(err) {
    //       console.log('Something went wrong!', err);
    //     });
    // }.bind(this), function(err) {
    //   console.log('Something went wrong!', err);
    // });
    //
    //
    //
    // axios
    //   .get(`/users/getFollowers/${this.props.profileUsername}`)
    //   .then(res => {
    //     console.log('get followers', res.data)
    //   });
    //
    // axios
    //   .get(`/users/getFollowing/${this.props.profileUsername}`)
    //   .then(res => {
    //     console.log('get following', res.data)
    //   });
    //
    axios
      .get('/users/getAllUsers')
      .then(res => {
        // console.log('all users', res.data)
        this.setState({allUsers: res.data.user})
      });

    this.getPlaylists(this.props.thisUsername)
  }


  handleInput = e => {
    this.setState({
      searchInput: e.target.value
    })
  }

  getPlaylists = (username) => {
    axios
      .get(`/users/getPlaylist/${username}`)
      .then(res => {
        console.log('get my playlists', res.data)
        this.setState({usersPlaylists: res.data})
      });
  }

  changeProfile = e => {
    let username = e.target.dataset.username
    console.log('USENAMe', username)
    this.setState({profileUsername: username})
    console.log('HERE!!!!!!!!', )
    axios
      .get(`/users/getUser/${username}`)
      .then(res => {
        console.log('get user', res.data)
        // this.renderProfile(props)
        this.getPlaylists(username)
        this.setState({searchInput: ''})
      })

  }

  renderProfile = (props) => {
    console.log('Rener profile', 'props', props)
    return (
      <Profile
        thisUsername={this.state.thisUsername}
        profileUsername={props.match.params.username}
        changeProfile={this.changeProfile}
        logout={this.props.logout}
        handleInput={this.handleInput}
        searchInput={this.state.searchInput}
        allUsers={this.state.allUsers}
        changeProfile={this.changeProfile}
        usersPlaylists={this.state.usersPlaylists}
      />
    )
  }

  render() {
    return (
      <Fragment>
        <Redirect to={`/users/${this.state.profileUsername}`} />
        <Route path = {`/users/:username`} render={this.renderProfile}/>
      </Fragment>
    )
  }
}

export default ProfileRouter;
