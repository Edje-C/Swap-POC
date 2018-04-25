import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

class Register extends Component {
  constructor(){
    super();
    this.state = {
      username: '',
      email: '',
      password: '',
      repassword: ''
    }
  }

  handleInput = e => {
    this.setState({
      [e.target.dataset.type]: e.target.value
    })
  }

  registerUser = e => {
    e.preventDefault()

    axios
      .post('/users/register', {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        })
      .then(res => {
        console.log(res.data)
        window.location = 'http://localhost:3100/users/spotifyLogin'
      })
      .catch(err => console.log(err));
  }

  render() {
    console.log('register', this.state)
    return (
      <div>
        <form onSubmit={this.registerUser}>
          <input data-type='username' type="text" value={this.state.username} onChange={this.handleInput} />
          <input data-type='email' type="text" value={this.state.email} onChange={this.handleInput} />
          <input data-type='password' type="password" value={this.state.password} onChange={this.handleInput} />
          <input data-type='repassword' type="password" value={this.state.repassword} onChange={this.handleInput} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default Register;
