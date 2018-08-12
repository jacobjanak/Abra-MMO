import React, { Component } from 'react';
import AuthService from './AuthService';
import withAuth from './withAuth';

const Auth = new AuthService();

class Home extends Component {
  state = {
    userId: this.props.user.id,
    profileLink: ''
  };

  componentDidMount() {
    const profileLinkURL = `/profile/${this.state.userId}`;
    this.setState({ profileLink: profileLinkURL })
  }

  handleLogout = () => {
    Auth.logout();
    this.props.history.replace('/signup');
  };

  goToEditProfile = () => {
    this.props.history.replace(this.state.profileLink);
  };

  render() {
    return (
      <div className="App">
        <button className="btn btn-primary" onClick={this.goToEditProfile}>
          Go to Profile
        </button>
        <button className="btn btn-danger" onClick={this.handleLogout}>
          Logout
        </button>
      </div>
    );
  }
}

export default withAuth(Home);
