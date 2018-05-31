import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios'
import '../../CSS/new.css'
import getTracks from './getTracks'

class New extends Component {
  constructor(){
    super();
    this.state = {
      title: '',
      length: 50,
      custom: false,
      customLength: '',
      lengthOptions: [],
      allUsers: [],
      friends: [],
      selectedFriends: ['ferminjan'],
      selectedFriendsIDs: [5],
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
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    let date = `${dd}/${mm}/${yyyy}`

    // axios
    //   .post('/users/createPlaylist', {
    //     username: this.props.thisUsername,
    //     name: this.state.title,
    //     length: this.state.length || this.state.customLength,
    //     date: date
    //   })
    //   .then(res => {
    //     let playlistID = res.data.id
    //     axios
    //       .post('/users/addCollaborators', {
    //         playlistID,
    //         userIDs: this.state.selectedFriendsIDs
    //       })
    //       .then(res => {
    //         console.log('ADDED collaborations', res)
    //       })
    //       .catch(err => {console.log(err)})

          getTracks.getSongs(this.props.spotifyApi, this.state.length, this.state.customLength, this.state.selectedFriends)
            .then(data => {
              //munipulate data so it only sends content you need the way you want it (duration) then send it to the backend

              

            //   axios
            //     .post('/users/saveTracks', {
            //       playlistID,
            //       tracks: data
            //     })
            //     .catch(err => {
            //       console.log('err', err)
            //     })
            // })
      });

  }


  setLength = e => {
    this.setState({
      length: Number(e.target.dataset.length),
      custom: false,
      customLength: ''
    })
  }

  setCustom = e => {
    this.setState({
      length: 0,
      custom: true,
      customLength: e.target.value
    })
  }

  setClass = num => (
    this.state.length === num && !this.state.custom ? 'selectedLength': ''
  )

  getLengths = () => {
    this.setState({lengthOptions: this.state.selectedFriends.length ?
      [25, 50, 75, 100].map(v => Math.floor(v/(this.state.selectedFriends.length+1)) * (this.state.selectedFriends.length+1) ):
      [25, 50, 75, 100]})
  }

  toggleFriend = e => {
    let index = this.state.selectedFriends.indexOf(e.target.dataset.name)
    let newFriendsArr = [...this.state.selectedFriends]
    let newIDsArr = [...this.state.selectedFriendsIDs]

    index > -1 ?
      (newFriendsArr.splice(index, 1), newIDsArr.splice(index, 1)):
      (newFriendsArr.push(e.target.dataset.name), newIDsArr.push(Number(e.target.dataset.id)))

    this.setState({selectedFriends: newFriendsArr, selectedFriendsIDs: newIDsArr, length: 0, customLength: ''})
  }

  handleInput = e => {
    this.setState({
      [e.target.dataset.type]: e.target.value
    })
  }

  modal = () => (
    <div className="modal" onClick={this.modalDown}>
      <div id="modal-search">
        <input type="text" data-type="searchInput" onChange={this.handleInput} value={this.state.searchInput}/>
        {this.state.searchInput ?
          this.state.allUsers.filter(v => v.username.includes(this.state.searchInput) && v.username !== this.props.thisUsername).map(v => (
            <div className="add-friend-container" data-name={v.username} data-id={v.id} onClick={this.toggleFriend}>
              <p>{v.username}</p>
              <button>{this.state.selectedFriends.includes(v.username)? "Remove" : "Add"}</button>
            </div>
          )):
          this.state.friends.map(v => (
            <div className="add-friend-container" data-name={v.username} data-id={Number(v.id)} onClick={this.toggleFriend}>
              <p data-name={v.username} data-id={Number(v.id)}>{v.username}</p>
              <button data-name={v.username} data-id={Number(v.id)}>{this.state.selectedFriends.includes(v.username)? "Remove" : "Add"}</button>
            </div>
          ))
        }
      </div>
      <div id="modal-panel">
        <div>
          <h3>Selected Friends</h3>
          {this.state.selectedFriends.map(v => <p>{v}</p>)}
        </div>
        <button id="modal-button" onClick={this.modalDown}>Done</button>
      </div>
    </div>
  )

  modalUp = () => {
    this.setState({
      renderModal: true
    })
  }

  modalDown = e => {
    if(e.target.className === 'modal' || e.target.id === 'modal-button'){
      this.setState({
        renderModal: false
      })
      this.getLengths()
    }
  }

  render() {
    // console.log('new', this.state, this.props)
    return (
      <div>
        {this.state.renderModal ? this.modal() : ''}
        <div className="new-section">
          <h2>Title</h2>
          <input type="text" data-type="title" onChange={this.handleInput}/>
        </div>
        <div className="new-section">
          <h2>Friends</h2>
          <button onClick={this.modalUp}>Add Friends</button>
          {this.state.selectedFriends.map(v => <p>{v}</p>)}
        </div>
        <div className="new-section">
          <h2>Length</h2>
          {this.state.lengthOptions.map(v => <button data-length={v} onClick={this.setLength} className={this.setClass(v)}>{v}</button>)}
          <form onSubmit={this.addFriend}>
            <input type="text" value={this.state.customLength} onChange={this.setCustom} className={this.state.custom ? 'customSelected': ''}/>
          </form>
        </div>
        <button onClick={this.createSwap}>Done</button>
      </div>
    );
  }
}

export default New;
