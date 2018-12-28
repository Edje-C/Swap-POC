import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
      .get('/login')
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
          <form onSubmit={this.loginUser} className="auth-form">
            <input className="auth-input" data-type='username' type="text" value={this.state.username} onChange={this.handleInput} placeholder="Username"/>
            <input className="auth-input" data-type='password' type="password" value={this.state.password} onChange={this.handleInput} placeholder="Password"/>
            <input className="auth-submit" type="submit" value="Login"/>
            <a href="http://localhost:3100/login">LOGIN</a>
          </form>
          <p className={`auth-message ${this.state.messageClassName}`}>{this.state.message}</p>
        </div>
        <p className="auth-link">Don't have an account yet? <Link to="/register">Register</Link></p>
      </div>
    );
  }
}

export default Login;
