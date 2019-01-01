import React, { Component } from 'react';
import axios from 'axios'
import '../../CSS/auth.css'

class Login extends Component {
  constructor(){
    super();
    this.state = {
      username: '',
      password: '',
      message: 'You found the secret message!',
      messageClassName: 'white'
    }
  }

  handleInput = e => {
    this.setState({
      [e.target.dataset.type]: e.target.value
    })
  }

  loginUser = e => {
    let {username, password} = this.state

    e.preventDefault()

    if(!username || !password) {
      this.setState({message: 'Please complete form.', messageClassName: 'auth-message'})
      return
    }

    axios
      .post('/users/login', {
          username: username,
          password: password
        })
        .then(res => {
          this.props.getUser()
        })
        .catch(err => {
          this.setState({message: 'Username or password is incorrect.', messageClassName: 'auth-message'})
        });
  }

  render() {
    return (
      <div className="auth">
        <div className="auth-container">
          <div className="logo">
            <h1 className="logo-S">S</h1>
            <p className="logo-name">Swap</p>
          </div>
          <div className="auth-form">
            <a href="https://spotify-swap.herokuapp.com/spotify-login" className="auth-submit">LOGIN</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
