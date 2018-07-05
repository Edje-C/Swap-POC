import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Access extends Component {

  componentDidMount(){
    this.getHashParams()
  }

  getHashParams = () => {
    const hashParams = {};
    let e;
    const r = /([^&;=]+)=?([^&;]*)/g;
    const q = window.location.hash.substring(1);

    while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }

    this.props.saveTokens(hashParams)
  }

  render() {
    return (
      this.props.access_token ?
        <Redirect to="/" /> :
        <div> Loading </div>
    );
  }
}
export default Access;
