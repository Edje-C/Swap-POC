import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Search extends Component {
  constructor(){
    super();
    this.state = {}
  }

  render(){
    let {users, search, thisUsername, changeProfile} = this.props
    return (
      <div id="search">
        {
        users.filter(v => (v.username.includes(search) && v.username !== thisUsername))[0] ?
          users.filter(v => v.username.includes(search) && v.username !== thisUsername).map(v =>
            <div className="search-link">
              <Link to = {`/users/${v.username}`} data-username={v.username} onClick={changeProfile}><i class="material-icons">person</i>{v.username}</Link>
            </div>):
            <h1>No Results Found</h1>
        }
      </div>
    );
  }
}

export default Search;
