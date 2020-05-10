import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../AuthService';
import './NavBar.css';

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
        <Link className="navbar-brand" to="/">Abra</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbar">
          <ul className="navbar-nav">
            { username && (
              <li className="nav-item">
                <Link className="nav-item nav-link" to={"/play"}>Play</Link>
              </li>
            )}
          </ul>
          { username ? (
            <ul className="navbar-nav ml-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" data-toggle="dropdown">
                  {username}
                </a>
                <div className="dropdown-menu dropdown-menu-right mt-3">
                  <Link className="dropdown-item" to={"/profile/" + username}>Profile</Link>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#" onClick={this.handleLogout}>Logout</a>
                </div>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="btn btn-outline-light mr-2" to={"/signup"}>Sign up</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-dark" to={"/login"}>Login</Link>
              </li>
            </ul>
          )}
          
        </div>
      </nav>
    );
  }
}

export default NavBar;
