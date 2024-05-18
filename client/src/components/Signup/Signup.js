import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import AuthService from '../AuthService';
import API from '../../API';
import './Signup.css';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
    }

    UNSAFE_componentWillMount() {
        if (this.Auth.user()) {
            window.location.href = '/';
        }
    }

    handleFormSubmit = event => {
        event.preventDefault();

        API.signUpUser({
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        })
            .then(() => {
                window.location.href = '/login';
            })
            .catch(err => alert(err));
    };

    handleChange = event => {
        const { name, value } = event.target;

        this.setState({
            [name]: value
        });
    };

    render() {
        return (
            <div id="signup-container" className="container">
                <h1 className="mb-3">Sign up</h1>
                <form onSubmit={this.handleFormSubmit}>
                    <div className="form-group">
                        <label className="mb-0" htmlFor="email">
                            Email address:
                        </label>
                        <input className="form-control"
                               placeholder="Email address"
                               name="email"
                               type="email"
                               id="email"
                               maxLength="50"
                               required
                               onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label className="mb-0" htmlFor="username">
                            Username:
                        </label>
                        <input className="form-control"
                               placeholder="Username"
                               name="username"
                               type="text"
                               id="username"
                               maxLength="12"
                               required
                               onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label className="mb-0" htmlFor="password">
                            Password:
                        </label>
                        <input className="form-control"
                               placeholder="Password"
                               name="password"
                               type="password"
                               id="password"
                               required
                               onChange={this.handleChange}/>
                    </div>
                    <div className="mt-4">
                        <button type="submit" className="btn btn-primary">Create account</button>
                        <Link className="ml-2" to="/login">Already have an account?</Link>
                    </div>
                </form>
            </div>
        );
    }
}

export default Signup;
