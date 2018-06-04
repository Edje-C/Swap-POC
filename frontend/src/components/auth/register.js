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
        this.props.getUser()
      })
      .catch(err => console.log(err));
  }

  render() {
    console.log('register', this.state)
    return (
      <div className="auth">
        <div className="auth-container">
          <div className="logo">
            <Link to={`/users/${this.props.thisUsername}`}  data-username={this.props.thisUsername} onClick={this.props.changeProfile, ()=>{this.setState({new: false, searchInput: ''})} }>
              <h1 data-username={this.props.thisUsername} >S</h1>
              <p className="blue" data-username={this.props.thisUsername} >Swap</p>
            </Link>
          </div>
          <form onSubmit={this.registerUser} className="auth-form">
            <input className="auth-input" data-type='username' type="text" value={this.state.username} onChange={this.handleInput} placeholder="Username"/>
            <input className="auth-input" data-type='email' type="text" value={this.state.email} onChange={this.handleInput} placeholder="Email"/>
            <input className="auth-input" data-type='password' type="password" value={this.state.password} onChange={this.handleInput} placeholder="Password"/>
            <input className="auth-input" data-type='repassword' type="password" value={this.state.repassword} onChange={this.handleInput} placeholder="Re-type Password"/>
            <input  className="auth-submit" type="submit" value="Register"/>
          </form>
        </div>
        <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    );
  }
}

export default Register;
