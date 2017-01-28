import React from 'react';
import NavBar from './navigation_bar/NavBar';

export default class App extends React.Component {

  render() {
    return (
      <div>
        <NavBar/>
        {this.props.children}
      </div>
    );
  }
}
