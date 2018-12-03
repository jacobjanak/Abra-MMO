import React, { Component } from 'react';
import AuthService from './AuthService';

const Auth = new AuthService();

class Home extends Component {
  handleLogout = () => {
    Auth.logout();
    this.props.history.replace('/signup');
  };

  render() {
    return (
      <div className="App">
        <div className="jumbotron">
          <h1 className="display-4">Hello, world!</h1>
          <p className="lead">Welcome to the best game you've ever played.</p>
          <p className="lead">
            <a className="btn btn-primary mr-2" href="/signup" role="button">Sign Up</a>
            <a className="btn btn-secondary" href="/login" role="button">Login</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Home;
