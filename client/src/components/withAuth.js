import React, { Component } from 'react';
import AuthService from './AuthService';

function withAuth(AuthComponent, props) {
  const Auth = new AuthService();

  return class AuthWrapped extends Component {
    state = { user: false };

    UNSAFE_componentWillMount() {
      const user = Auth.user();
      if (user) {
        this.setState({ user })
      } else {
        this.props.history.replace('/login');
      }
    }

    render() {
      const { history, match } = this.props;
      const { user } = this.state;

      if (user) {
        return <AuthComponent history={history} match={match} user={user} {...props} />;
      } else {
        return null;
      }
    }
  };
}

export default withAuth;
