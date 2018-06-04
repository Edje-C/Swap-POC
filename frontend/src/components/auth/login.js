import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios'
import '../../CSS/auth.css'

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
          this.props.getUser()
        })
        .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="auth">
        <div className="auth-container">
          <div className="logo">
            <h1>S</h1>
            <p className="blue">Swap</p>
          </div>
          <form onSubmit={this.loginUser} className="auth-form">
            <input className="auth-input" data-type='username' type="text" value={this.state.username} onChange={this.handleInput} placeholder="Username"/>
            <input className="auth-input" data-type='password' type="password" value={this.state.password} onChange={this.handleInput} placeholder="Password"/>
            <input  className="auth-submit" type="submit" value="Login"/>
          </form>
        </div>
        <p className="auth-link">Don't have an account yet? <Link to="/register">Register</Link></p>
      </div>
    );
  }
}

export default Login;
