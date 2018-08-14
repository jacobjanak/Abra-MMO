import React, { Component } from 'react';
import withAuth from './withAuth';
import API from '../API';
import { Link } from 'react-router-dom';

class Profile extends Component {
  state = {
    username: this.props.user.username,
    email: this.props.user.email
  };

  render() {
    return (
      <div className="container Profile">
        <h1>On the profile page!</h1>
        <p>Username: {this.state.username}</p>
        <p>Email: {this.state.email}</p>
        <Link to="/">Go home</Link>
      </div>
    )
  }
}

export default withAuth(Profile);
