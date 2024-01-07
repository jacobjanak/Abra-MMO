import React, {Component} from 'react';
import AuthService from './AuthService';

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
                window.location.href = '/login';
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
