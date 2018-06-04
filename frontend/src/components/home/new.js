import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios'
import '../../CSS/new.css'
import modules from './modules'

class New extends Component {
  constructor(){
    super();
    this.state = {
      title: '',
      length: 24,
      lengthOptions: [],
      allUsers: [],
      friends: [],
      selectedFriends: [],
      selectedFriendsIDs: [],
      renderModal: false,
      searchInput: '',
      tracks: []
    }
  }

  componentDidMount(){
    axios
      .get('/users/getAllUsers')
      .then(res => {this.setState({allUsers: res.data.user})});

    axios
      .get(`/users/getFollowing/${this.props.thisUsername}`)
      .then(res => {
        this.setState({friends: res.data})
      });

    this.getLengths()
  }

  createSwap = () => {
    axios
      .post('/users/createPlaylist', {
        username: this.props.thisUsername,
        name: this.state.title,
        length: this.state.length,
        date: modules.getDate()
      })
      .then(res => {
        let playlistID = res.data.id
        console.log('!!!!!!!' ,typeof playlistID)
        axios
          .post('/users/addCollaborators', {
            playlistID,
            userIDs: this.state.selectedFriendsIDs
          })
          .then(res => {
            console.log('ADDED collaborations', res)
          })
          .catch(err => {console.log(err)})

          modules.getSongs(this.props.spotifyApi, this.state.length, this.state.selectedFriends.length)
            .then(data => {
              let neededData = data.map(v => {
                  return {
                    trackURI: v.id,
                    name: v.name.replace(/(')/g, "''"),
                    duration: modules.getDuration(v.duration_ms),
                    artists: v.artists.map(v => v.name).join(', ').replace(/(')/g, "''"),
                    album: v.album.name.replace(/(')/g, "''")
                  }
              })

              console.log('neededData', neededData)
              axios
                .post('/users/saveTracks', {
                  playlistID: playlistID,
                  tracks: neededData
                })
                .then(data => {
                  this.props.toggleNew()
                })
                .catch(err => {
                  console.log('err', err)
                })
            });
      })
  }


  setLength = e => {
    this.setState({
      length: Number(e.target.dataset.length)
    })
  }

  setClass = num => (
    this.state.length === num ? 'selectedLength' : ''
  )

  getLengths = () => {
    this.setState({lengthOptions: this.state.selectedFriends.length ?
      [25, 50, 75, 100, 200, 250].map(v => Math.floor(v/(this.state.selectedFriends.length+1)) * (this.state.selectedFriends.length+1) ):
      [25, 50, 75, 100, 200, 250]})
  }

  toggleFriend = e => {
    let index = this.state.selectedFriends.indexOf(e.target.dataset.name)
    let newFriendsArr = [...this.state.selectedFriends]
    let newIDsArr = [...this.state.selectedFriendsIDs]

    index > -1 ?
      (newFriendsArr.splice(index, 1), newIDsArr.splice(index, 1)):
      (newFriendsArr.push(e.target.dataset.name), newIDsArr.push(Number(e.target.dataset.id)))

    this.setState({selectedFriends: newFriendsArr, selectedFriendsIDs: newIDsArr, length: 0})
  }

  handleInput = e => {
    this.setState({
      [e.target.dataset.type]: e.target.value
    })
  }

  modal = () => {
    let friendsList = this.state.searchInput ? this.state.allUsers : this.state.friends
    return (<div className="modal" onClick={this.modalDown}>
      <div id="modal-search">
        <input id="add-friend-input" type="text" data-type="searchInput" onChange={this.handleInput} value={this.state.searchInput}/>
        {
          friendsList.filter(v => v.username.includes(this.state.searchInput) && v.username !== this.props.thisUsername).map(v => (
            <div className="add-friend-container" data-name={v.username} data-id={Number(v.id)} onClick={this.toggleFriend}>
              <p data-name={v.username} data-id={Number(v.id)}>{v.username}</p>
              <button data-name={v.username} data-id={Number(v.id)}>{this.state.selectedFriends.includes(v.username)? <i class="material-icons background-color" data-name={v.username} data-id={Number(v.id)} onClick={this.toggleFriend}>remove</i> :  <i class="material-icons green" data-name={v.username} data-id={Number(v.id)} onClick={this.toggleFriend}>add</i>}</button>
            </div>
          ))
        }
      </div>
      <div id="modal-panel">
        <div>
          <h3>Selected Friends</h3>
          {this.state.selectedFriends.map(v => <p>{v}</p>)}
        </div>
        <button id="modal-done" onClick={this.modalDown}>Done</button>
      </div>
    </div>)
  }

  modalUp = () => {
    this.setState({
      renderModal: true
    })
  }

  modalDown = e => {
    if(e.target.className === 'modal' || e.target.id === 'modal-done'){
      this.setState({
        renderModal: false
      })
      this.getLengths()
    }
  }

  render() {
    console.log('new', this.state, this.props)
    // this.getDuration(231857)
    return (
      <div>
        {this.state.renderModal ? this.modal() : ''}
        <div className="new-section">
          <h2 className="new-title">Title</h2>
          <input id="new-title-input" type="text" data-type="title" onChange={this.handleInput}/>
        </div>
        <div className="new-section">
          <h2 className="new-title">Friends</h2>
          <button id="add-friends-button" onClick={this.modalUp}>Add Friends</button>
          <div id="selected-friends">
            {this.state.selectedFriends.map(v => <p className="friend">{v}</p>)}
          </div>
        </div>
        <div className="new-section">
          <h2 className="new-title">Length</h2>
          <div id="lengths">
            {this.state.lengthOptions.map(v => <button className={`length ${this.setClass(v)}`} data-length={v} onClick={this.setLength}>{v}</button>)}
          </div>
        </div>
        <div id="done-section">
          <button id="new-done" onClick={this.createSwap}>Done</button>
        </div>
      </div>
    );
  }
}

export default New;
