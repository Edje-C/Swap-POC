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
      usersPlaylists: [],
      searchInput: '',
      new: false,
      following: false,
      friendsModal: false,
      errorModal: false,
      errorModalMessgage: '',
      allUsers: [],
      friends: [],
      unfollowList: [],
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
          // console.log('get follow', res.data)
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
    let {thisUsername, profileUsername} = this.props
    console.log('GETTING FOLLOWING', thisUsername, profileUsername)
    axios
      .get(thisUsername === profileUsername ? `/users/getFollowing/${thisUsername}` : `/users/getOtherFollowing/${this.props.thisUserID}/${profileUsername}`)
      .then(res => {
        console.log('friends', res.data)
        this.setState({friends: res.data})
      });
  }

  changeProfile = e => {
    let username = e.target.dataset.username
    console.log('', username)
    axios
      .get(`/users/getUser/${username}`)
      .then(res => {
        this.getFollowing()
        this.getPlaylists(username)
        this.setState({
          new: false,
          searchInput: '',
          friendsModal: false
        })
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
        followingUsername: this.props.profileUsername
      })
      .then(res => {
        axios
          .get(`/users/getFollow/${this.props.thisUserID}/${this.props.profileUsername}`)
          .then(res => {
            console.log('get follow', res.data)
            this.setState({following: !!res.data[0]})
          });
      })
      .catch(err => console.log(err))
  }

  toggleFollow = e => {
    console.log('toggle', e.target.key)
    let unfollowList = this.state.unfollowList,
        id = Number(e.target.dataset.id)

    if(e.target.innerText === 'remove') {
      e.target.innerText = "add"
      e.target.className = 'material-icons green'
      unfollowList.push(id)
    } else {
      e.target.innerText = "remove"
      e.target.className = 'material-icons background-color'
      let index = unfollowList.indexOf(id)
      unfollowList.splice(index, 1)
    }
    this.setState({unfollowList})
  }

  modalDown = e => {
    if(e.target.className === 'modal' || e.target.id === 'modal-error-cancel'){
      if(this.state.unfollowList[0]) {
        axios
          .post('/users/unfollowMany', {
            followerID: this.props.thisUserID,
            followingIDs: this.state.unfollowList
          })
          .then(res => {
            console.log(res)
          })
          .catch(err => {console.log(err)})
      }
      this.setState({
        friendsModal: false,
        errorModal: false,
        unfollowList: []
      })
      this.getFollowing()
    }
  }

  triggerErrorModal = message => {
    this.setState({errorModal: true, errorModalMessgage: message})
  }

  renderFriendsModal = () => (
    <div className="modal" onClick={this.modalDown}>
      <div id="friend-modal"  onClick={this.getFollowing}>
        {this.state.friends.map(v =>
          (
            <div className="add-friend-container" data-name={v.username} data-id={Number(v.id)}>
              <Link to={`/users/${v.username}`} data-username={v.username} onClick={this.changeProfile}>{v.username}</Link>
              {v.username === this.props.thisUsername ? null : <i class="material-icons background-color" data-name={v.username} data-id={Number(v.id)} onClick={this.toggleFollow}>remove</i>}
            </div>
          )
        )}
      </div>
    </div>
  )

  renderErrorModal = () => (
    <div className="modal" onClick={this.modalDown}>
      <div id="error-modal">
      </div>
    </div>
  )

  renderProfile = (props) => {
    return this.props.thisUsername ?
      (this.props.access_token || (this.props.thisUsername !== this.props.profileUsername) ?
        (
          <Profile
            allUsers={this.state.allUsers}
            changeProfile={this.changeProfile}
            getPlaylists={this.getPlaylists}
            handleInput={this.handleInput}
            logout={this.props.logout}
            new={this.state.new}
            profileUsername={this.props.profileUsername}
            searchInput={this.state.searchInput}
            spotifyApi={this.props.spotifyApi}
            thisUserID={this.props.thisUserID}
            thisUsername={this.props.thisUsername}
            thisUserSpotifyID={this.props.thisUserSpotifyID}
            toggleNew={this.toggleNew}
            usersPlaylists={this.state.usersPlaylists}
            triggerErrorModal={this.triggerErrorModal}
          />
        ) :
        window.location = "http://localhost:3100/users/spotifyLogin") :
      <div>Loading</div>
  }

  render() {
    console.log('PR', this.state, this.props)
    let {thisUsername, profileUsername} = this.props
    return (
      <div  id="profile">
        {this.state.friendsModal ? this.renderFriendsModal() : ''}
        {this.state.errorModal ? this.renderErrorModal() : ''}
        <div id="profile-data">
          <div className="logo">
            <Link to={`/users/${thisUsername}`} data-username={thisUsername} onClick={this.changeProfile}>
              <h1  className="logo-S"data-username={thisUsername} >S</h1>
              <p className="logo-name" data-username={thisUsername} >Swap</p>
            </Link>
          </div>
          <h2>{profileUsername}</h2>
          <h3><button id="friends-modal-button" onClick={()=>{this.setState({friendsModal: true})}}>{`${this.state.friends.length} Friends`}</button></h3>
          {
            thisUsername !== profileUsername ?
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
