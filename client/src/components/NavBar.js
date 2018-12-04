import React, { Component } from 'react';
import AuthService from './AuthService';

class NavBar extends Component {
  state = { username: '' };
  Auth = new AuthService();

  componentDidMount() {
    const user = this.Auth.user();
    if (user) {
      this.setState({ username: user.username })
    }
  }

  handleLogout = () => {
    this.Auth.logout()
    window.location.reload()
  };

  render() {
    const { username } = this.state;

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ zIndex: 500 }}>
        <a className="navbar-brand" href="/">Abra</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbar">
          <ul className="navbar-nav">
            { username && (
              <li className="nav-item">
                <a className="nav-item nav-link" href="/play">Play</a>
              </li>
            )}
          </ul>
          { username ? (
            <ul className="navbar-nav ml-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {username}
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href={"/profile/" + username}>Profile</a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#" onClick={this.handleLogout}>Logout</a>
                </div>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="btn btn-outline-light mr-2" href="/signup" role="button">Sign Up</a>
              </li>
              <li className="nav-item">
                <a className="btn btn-dark" href="/login" role="button">Login</a>
              </li>
            </ul>
          )}
          
        </div>
      </nav>
    );
  }
}

export default NavBar;
