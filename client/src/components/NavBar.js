import React, { Component } from 'react';
import AuthService from './AuthService';

class NavBar extends Component {
  state = { username: '' };
  Auth = new AuthService();

  componentDidMount() {
    this.setState({ username: this.Auth.user().username })
  }

  handleLogout = () => {
    this.Auth.logout()
    window.location.reload()
  };

  render() {
    const { username } = this.state;

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary" style={{ zIndex: 500 }}>
        <a className="navbar-brand" href="/">Home</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbar">
          <div className="navbar-nav">
            <a className="nav-item nav-link" href="/play">Play Now</a>
          </div>
          <div className="navbar-nav ml-auto">
          <a className="nav-item nav-link" href={"/profile/" + username}>Profile</a>
          <a className="nav-item nav-link" href="#" onClick={this.handleLogout}>Logout</a>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
