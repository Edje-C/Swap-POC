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
      new: true,
      following: false,
      renderModal: false,
      allUsers: [],
      friends: [],
      access_token: this.props.access_token
    }
  }

  componentDidMount(){
    this.initializeState(this.props)
  }

  componentWillReceiveProps(nextprops){
    this.initializeState(nextprops)
  }

  initializeState = props => {

    if(props.thisUsername !== props.profileUsername) {
      axios
        .get(`/users/getFollow/${props.thisUserID}/${props.profileUsername}`)
        .then(res => {
          console.log('get follow', res.data)
          this.setState({following: !!res.data[0]})
        });
    }

    axios
      .get('/users/getAllUsers')
      .then(res => {
        this.setState({allUsers: res.data.user})
      });

      this.setState({
        thisUsername: props.thisUsername,
        profileUsername: props.profileUsername
      })

      this.getPlaylists(props.profileUsername)
      this.getFollowing()
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
        this.setState({usersPlaylists: res.data})
      })
      .catch(err => {console.log(err)})
  }

  getFollowing = () => {
    axios
      .get(`/users/getFollowing/${this.props.profileUsername}`)
      .then(res => {
        console.log('friends', res.data)
        this.setState({friends: res.data})
      });
  }

  changeProfile = e => {
    let username = e.target.dataset.username
    this.setState({profileUsername: username})
    axios
      .get(`/users/getUser/${username}`)
      .then(res => {
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

  toggleFriend = e => {
    axios
      .post(this.state.following ? '/users/unfollowUser' : '/users/followUser', {
        followerID: this.props.thisUserID,
        followingUsername: this.state.profileUsername
      })
      .then(res => {
        axios
          .get(`/users/getFollow/${this.props.thisUserID}/${this.state.profileUsername}`)
          .then(res => {
            console.log('get follow', res.data)
            this.setState({following: !!res.data[0]})
          });
      })
      .catch(err => console.log(err))
  }

  toggleFollow = e => {
    console.log('toggle')
    e.persist()
    axios
      .post(e.target.innerText === 'remove' ? '/users/unfollowUser' : '/users/followUser', {
        followerID: this.props.thisUserID,
        followingUsername: e.target.dataset.name
      })
      .then(res => {
        e.target.innerText === 'remove' ?
          (e.target.innerText = "add", e.target.className = 'material-icons green'):
          (e.target.innerText = "remove", e.target.className = 'material-icons background-color')
      })
  }

  modalUp = e => {
    this.setState({
      renderModal: true
    })
  }

  modalDown = e => {
    if(e.target.className === 'modal' || e.target.id === 'modal-cancel'){
      this.setState({
        renderModal: false
      })
      this.getFollowing()
    }
  }

  renderFriendsModal = () => (
    <div className="modal" onClick={this.modalDown}>
      <div id="friend-modal"  onClick={this.getFollowing}>
        {this.state.friends.map(v => (
          <div className="add-friend-container" data-name={v.username} data-id={Number(v.id)}>
            <p data-name={v.username} data-id={Number(v.id)}>{v.username}</p>
            <p data-name={v.username} data-id={Number(v.id)}>{<i class="material-icons background-color" data-name={v.username} data-id={Number(v.id)} onClick={this.toggleFollow}>remove</i>}</p>
          </div>
        ))}
      </div>
    </div>
  )

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
    console.log('PR', this.state, this.props)
    return (
      <div  id="profile">
        {this.state.renderModal ? this.renderFriendsModal() : ''}
        <div id="profile-data">
          <div className="logo">
            <Link to={`/users/${this.props.thisUsername}`} data-username={this.props.thisUsername} onClick={this.props.changeProfile, ()=>{this.setState({new: false, searchInput: ''})} }>
              <h1  className="logo-S"data-username={this.props.thisUsername} >S</h1>
              <p className="logo-name" data-username={this.props.thisUsername} >Swap</p>
            </Link>
          </div>
          <h2>{this.props.profileUsername}</h2>
          <h3><button id="friends-modal-button" onClick={this.modalUp}>{`${this.state.friends.length} Friends`}</button></h3>
          {
            this.props.thisUsername !== this.props.profileUsername ?
              this.state.following ?
                <button onClick={this.toggleFriend}>Friend</button> : <button onClick={this.toggleFriend}>friend</button> :
              <h3 id="logout"><button onClick={this.props.logout}>logout</button></h3>
          }
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
