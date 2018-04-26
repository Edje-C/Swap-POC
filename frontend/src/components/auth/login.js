import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios'

class Login extends Component {
  constructor(){
    super();
    this.state = {
      username: '',
      password: ''
    }
  }

  handleInput = e => {
    this.setState({
      [e.target.dataset.type]: e.target.value
    })
  }

  loginUser = e => {
    e.preventDefault()

    axios
      .post('/users/login', {
          username: this.state.username,
          password: this.state.password
        })
        .then(res => {
          console.log(res.data)
          window.location = 'http://localhost:3100/users/spotifyLogin'
        })
        .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <form onSubmit={this.loginUser}>
          <input data-type='username' type="text" value={this.state.username} onChange={this.handleInput} />
          <input data-type='password' type="password" value={this.state.password} onChange={this.handleInput} />
          <input type="submit" />
        </form>
        <Link to="/register">register</Link>
      </div>
    );
  }
}

export default Login;
