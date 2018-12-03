import React, { Component } from 'react';

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary" style={{ zIndex: 500 }}>
        <a className="navbar-brand" href="/">Home</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbar">
          <div className="navbar-nav">
            <a className="nav-item nav-link" href="/profile">Profile</a>
            <a className="nav-item nav-link" href="/play">Play Now</a>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
