import React, { Component } from 'react';
import withAuth from './withAuth';
import API from '../API';
import { Link } from 'react-router-dom';

class Profile extends Component {
  state = {
    username: '',
    wins: false,
    losses: false,
  };

  componentDidMount() {
    API.getUser(this.props.match.params.username)
    .then(res => {
      console.log(res)
      const user = res.data;
      this.setState({ ...user })
    })
  }

  render() {
    return (
      <div className="container">
        <p></p>
        <h1>{this.state.username}</h1>
        <p></p>
        <p>Wins: {this.state.wins}</p>
        <p>Losses: {this.state.losses}</p>
        <Link to="/">Go home</Link>
      </div>
    )
  }
}

export default withAuth(Profile);
