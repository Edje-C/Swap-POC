import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios'
import '../../CSS/home.css'

class New extends Component {
  constructor(){
    super();
    this.state = {
      title: '',
      friends: ['tonya', 'jamaia', 'rachel', 'monique'],
      length: 0,
      custom: false,
      customLength: '',
      lengthOptions: [],
      allUsers: []
    }
  }

  componentDidMount(){
    axios
      .get('/users/getAllUsers')
      .then(res => {
        this.setState({allUsers: res.data.user})
      });

    this.getLengths()
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
    this.state.length === num && !this.state.custom ?
      'selectedLength':
      ''
  )

  submitSwap = () => {
    console.log(Math.floor(this.state.customLength/(11)), this.state.customLength%(11))
  }

  getLengths = () => {
    console.log('friuneda', 5/ (this.state.friends.length+1))
    this.setState({lengthOptions: this.state.friends.length ?
      [25, 50, 75, 100].map(v => Math.floor(v/(this.state.friends.length+1)) * (this.state.friends.length+1) ):
      [25, 50, 75, 100]})
  }

  addFriend = e => {
    e.preventDefault()
    console.log('!!!', e)
  }

  handleInput = e => {
    this.setState({
      [e.target.dataset.type]: e.target.value
    })
  }

  render() {
    console.log('new', this.state, this.props)
    return (
      <div>
        <div className="new-section">
          <h2>Title</h2>
          <input type="text" data-type="title" onChange={this.handleInput}/>
        </div>
        <div className="new-section">
          <h2>Friends</h2>
          <input type="text" data-type="friends" onChange={this.handleInput}/>
        </div>
        <div className="new-section">
          <h2>Length</h2>
          {this.state.lengthOptions.map(v => <button data-length={v} onClick={this.setLength} className={this.setClass(v)}>{v}</button>)}
          <form onSubmit={this.addFriend}>
            <input type="text" value={this.state.customLength} onChange={this.setCustom} className={this.state.custom ? 'customSelected': ''}/>
          </form>
        </div>
        <button onClick={this.submitSwap}>Done</button>
      </div>
    );
  }
}

export default New;
