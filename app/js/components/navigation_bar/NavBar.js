import React from 'react'
import Parse from 'parse'
import { Link } from 'react-router'

require('./style.less');

export default class NavBar extends React.Component {

  onLogout() {
    Parse.User.logOut()
    this.props.history.replace('/login')
  }

  render() {
    return (
      <div id='navbar'>
        {this.renderLogout()}
      </div>
    )
  }

  renderLogout() {
    if (!Parse.User.current()) { return false }
    return (
      <Link to='/' onClick={this.onLogout.bind(this)}>
        Logout
      </Link>
    )
  }
}
