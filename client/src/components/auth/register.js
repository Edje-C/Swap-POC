import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Register extends Component {
  constructor(){
    super();
    this.state = {
      username: '',
      email: '',
      password: '',
      repassword: '',
      message: 'You found the secret message!',
      messageClassName: 'white'
    }
  }

  handleInput = e => {
    this.setState({
      [e.target.dataset.type]: e.target.value
    })
  }

  validateInputs = (username, email, password, repassword) => {

    if(!username || !email || !password || !repassword) {
      this.setState({message: 'Please complete form.', messageClassName: 'auth-message'})
      return false
    }

    if(username.length < 6 || username.length > 15) {
      this.setState({message: 'Username should be between 6-15 characters.', messageClassName: 'auth-message'})
      return false
    }

    if(email.length > 30) {
      this.setState({message: 'Email is too long.', messageClassName: 'auth-message'})
      return false
    }

    if(!(email.match(/([\w])+/g).length >= 3) || !(email.match(/[@.]+/g).length >= 2) || !email.match(/\.\w+$/g)) {
      this.setState({message: 'Please input valid email.', messageClassName: 'auth-message'})
      return false
    }

    if(password.length < 6 || password.length > 20) {
      this.setState({message: 'Password should be between 6-20 characters.', messageClassName: 'auth-message'})
      return false
    }

    if(!password.match(/[a-z]/g)) {
      this.setState({message: 'Password should contain at least one lowercase letter.', messageClassName: 'auth-message'})
      return false
    }

    if(!password.match(/[A-Z]/g)) {
      this.setState({message: 'Password should contain at least one capital letter.', messageClassName: 'auth-message'})
      return false
    }

    if(!password.match(/\d/g)) {
      this.setState({message: 'Password should contain at least one number.', messageClassName: 'auth-message'})
      return false
    }

    if(!password.match(/[!@#\-+=$%_^&/*(),.?":{}|<>]/g)) {
      this.setState({message: 'Password should contain at least one special character.', messageClassName: 'auth-message'})
      return false
    }

    if(password !== repassword) {
      this.setState({message: 'Passwords must match.', messageClassName: 'auth-message'})
      return false
    }

    return true
  }

  registerUser = e => {
    let {username, email, password, repassword} = this.state

    e.preventDefault()

    if(!this.validateInputs(username, email, password, repassword)) {
      return
    }

    axios
      .post('/register', {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        })
      .then(res => {
        axios
          .post('/login', {
              username: this.state.username,
              password: this.state.password
            })
          .then(res => {
            this.props.getUser()
          })
          .catch(err => {
            this.setState({message: 'Cannot login user.', messageClassName: 'auth-message'})
          });
      })
      .catch(err => {
        this.setState({message: 'Something went wrong.', messageClassName: 'auth-message'})
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
          <form onSubmit={this.registerUser} className="auth-form">
            <input className="auth-input" data-type='username' type="text" value={this.state.username} onChange={this.handleInput} placeholder="Username"/>
            <input className="auth-input" data-type='email' type="text" value={this.state.email} onChange={this.handleInput} placeholder="Email"/>
            <input className="auth-input" data-type='password' type="password" value={this.state.password} onChange={this.handleInput} placeholder="Password"/>
            <input className="auth-input" data-type='repassword' type="password" value={this.state.repassword} onChange={this.handleInput} placeholder="Re-type Password"/>
            <input  className="auth-submit" type="submit" value="Register"/>
          </form>
          <p className={`auth-message ${this.state.messageClassName}`}>{this.state.message}</p>
        </div>
        <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    );
  }
}

export default Register;
