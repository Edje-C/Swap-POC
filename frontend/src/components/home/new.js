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
      selectedFriendsIDs: ['a'],
      renderModal: false,
      searchInput: '',
      tracks: [],
      error: false,
      message: 'Please complete form.',
      messageClass: 'new-message background-color'
    }
  }

  componentDidMount(){
    axios
      .get('/users/getAllUsers')
      .then(res => {this.setState({allUsers: res.data.user})});

    axios
      .get(`/users/getFollowing/${this.props.thisUsername}`)
      .then(res => {
        console.log('res.data')
        this.setState({friends: res.data})
      });

    this.getLengths()
  }

  complete = _ => {
    let {title, selectedFriends, length} = this.state

    if(!title) {
      this.setState({message: 'Give this Swap a title.', messageClass: 'new-message'})
      return false
    }

    if(selectedFriends.length < 1) {
      this.setState({message: 'Invite at least one friend.', messageClass: 'new-message'})
      return false
    }

    if(length < 10 || length%(selectedFriends.length+1)) {
      this.setState({message: 'Choose a length for your playlist.', messageClass: 'new-message'})
      return false
    }

    this.setState({message: 'Processing', messageClass: 'new-message'})
    return true

  }

  createSwap = () => {

    if(!this.complete()) {
      return
    }

    modules.getSongs(this.props.spotifyApi, this.state.length, this.state.selectedFriends.length)
      .then(data => {
        console.log('DATA!', data)
        if(!data || !data[0]) {
          this.setState({message: 'Something went wrong!'})
          return
        }

        let neededData = data.map(v => {
                return {
                  trackURI: v.id,
                  name: v.name.replace(/(')/g, "''"),
                  duration: modules.getDuration(v.duration_ms),
                  artists: v.artists.map(v => v.name).join(', ').replace(/(')/g, "''"),
                  album: v.album.name.replace(/(')/g, "''")
                }
            })

        axios
          .post('/users/createPlaylist', {
            username: this.props.thisUsername,
            name: this.state.title,
            length: this.state.length,
            date: modules.getDate(),
            userIDs: this.state.selectedFriendsIDs,
            tracks: neededData
          })
          .then(res => {
            this.setState({message: 'Success'})
            this.props.toggleNew()
          })
          .catch(err => {
            this.props.triggerErrorModal('creating your playlist')
          });
        })
        .catch(err => {
          this.props.triggerErrorModal('getting songs from your Spotify account')
        })
  }


  setLength = e => {
    console.log('setting length')
    this.setState({
      length: Number(e.target.dataset.length)
    })
  }

  setClass = num => (
    this.state.length === num ? 'selectedLength' : ''
  )

  getLengths = () => {
    this.setState({lengthOptions: this.state.selectedFriends.length ?
      [25, 50, 75, 100, 200].map(v => Math.floor(v/(this.state.selectedFriends.length+1)) * (this.state.selectedFriends.length+1) ):
      [25, 50, 75, 100, 200]})
  }

  toggleFriend = e => {
    if(this.state.selectedFriends.length === 10) {
      return
    }
    let index = this.state.selectedFriends.indexOf(e.target.dataset.name)
    let newFriendsArr = [...this.state.selectedFriends]
    let newIDsArr = [...this.state.selectedFriendsIDs]

    index > -1 ?
      (newFriendsArr.splice(index, 1), newIDsArr.splice(index, 1)):
      (newFriendsArr.push(e.target.dataset.name), newIDsArr.push(Number(e.target.dataset.id)))

    this.setState({selectedFriends: newFriendsArr, selectedFriendsIDs: newIDsArr, length: 0})
  }

  handleInput = e => {
    let name = e.target.dataset.type
    let value = e.target.value
    console.log(value, value.length)
    if(name === 'title') {
      if (value.length === 30){
        this.setState({[name]: value})
        return
      }
      if (value.length-1 >= 30){
        this.setState({[name]: value.substr(0,30)})
        return
      }
    }

    this.setState({[name]: value})
  }

  modal = () => {
    let friendsList = this.state.searchInput ? this.state.allUsers : this.state.friends
    return (
      <div className="modal" onClick={this.modalDown}>
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
          <div id="modal-panel-top">
            <h3>Selected Friends</h3>
            <div id="selected-friends-container">
              {this.state.selectedFriends.map(v => <p className="modal-selected-friend">{v}</p>)}
            </div>
          </div>
          <div id="modal-panel-bottom">
            <p>{`${this.state.selectedFriends.length}/10`}</p>
            <button id="modal-done" onClick={this.modalDown}>Done</button>
          </div>
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
    console.log('new', this.state)
    return (
      <div id="new">
        {this.state.renderModal ? this.modal() : null}
        <div className="new-section">
          <h2 className="new-title">Title</h2>
          <div className="action-cap">
            <input id="new-title-input" type="text" data-type="title" onChange={this.handleInput} value={this.state.title}/>
            <p className='cap'>{`${this.state.title.length}/30`}</p>
          </div>
        </div>
        <div className="new-section">
          <h2 className="new-title">Friends</h2>
          <div className="action-cap">
            <button id="add-friends-button" onClick={this.modalUp}>Add Friends</button>
            <p className='cap'>{`${this.state.selectedFriends.length}/10`}</p>
          </div>
          <div id="selected-friends">
            {this.state.selectedFriends.map(v => <p className="new-selected-friend">{v}</p>)}
          </div>
        </div>
        <div className="new-section">
          <h2 className="new-title">Length</h2>
          <div id="lengths">
            {this.state.lengthOptions.map(v => <button className={`length ${this.setClass(v)}`} data-length={v} onClick={this.setLength}>{v}</button>)}
          </div>
        </div>
        <div id="done-section">
          <p className={this.state.messageClass}>{this.state.message}</p>
          <button id="new-done" onClick={this.createSwap}>Done</button>
        </div>
      </div>
    );
  }
}

export default New;
