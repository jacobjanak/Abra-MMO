import React, {Component} from 'react';
import { generateUsername } from 'friendly-username-generator';
import AuthService from './AuthService';
import API from '../API';
import utils from '../utils';
import withInternet from './withInternet';
import Login from './Login';

function withAuth(AuthComponent, props) {
    const Auth = new AuthService();

    return class AuthWrapped extends Component {
        state = {
            user: false
        };

        UNSAFE_componentWillMount() {
            const user = Auth.user();

            if (user) {
                this.setState({user})
            } else {
                // Automatically create an account
                const username = generateUsername();
                const password = utils.randomString(40);

                API.signUpUser({ username, password })
                    .then(() => Auth.login(username, password))
                    .then(() => window.location.reload())
                    .catch(err => console.error(err));
            }
        }

        render() {
            const {user} = this.state;

            if (user) {
                return <AuthComponent user={user} {...props} />;
            } else {
                return null;
            }
        }
    };
}

export default withAuth;
