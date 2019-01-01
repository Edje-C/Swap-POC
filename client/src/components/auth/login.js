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

  loginUser = () => {
    axios
      .get('/spotify-login')
      .then((req, res) => {
        console.log(req, res)
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
            {/* <div onClick={this.loginUser} className="auth-submit">LOGIN</div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
