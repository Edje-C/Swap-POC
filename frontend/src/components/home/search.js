import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

class Search extends Component {
  constructor(){
    super();
    this.state = {}
  }

  render(){
    console.log('!!!!!!!!!PROPS', this.props)
    let {users, search, thisUsername, changeProfile} = this.props
    let filteredUsers = users.filter(v => v.username.includes(search) && v.username !== thisUsername)
    return (
      <div>
        {
        filteredUsers.filter(v => v.username.includes(search))[0] ?
          // filteredUsers.filter(v => v.username.includes(search)).map(v => <button data-username={v.username} onClick={changeProfile} >{v.username}</button>):
          filteredUsers.filter(v => v.username.includes(search)).map(v => <Link to = {`/users/${v.username}`} data-username={v.username} onClick={changeProfile} >{v.username}</Link>):
          <h1>No Results Found</h1>
        }
      </div>
    );
  }
}

export default Search;
