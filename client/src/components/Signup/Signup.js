import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import AuthService from '../AuthService';
import API from '../../API';
import './Signup.css';

class Signup extends Component {
    state = {
        confirm: '',
        confirmError: false
    }

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
        if (this.state.password === this.state.confirm) {
            API.signUpUser({
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            })
                .then(() => {
                    window.location.href = '/login';
                })
                .catch(err => alert(err));
        } else {
            this.setState({
                confirm: '',
                confirmError: true
            })
        }
    };

    handleChange = event => {
        const {name, value} = event.target;
        let fixingConfirm = this.state.confirmError && name === 'confirm';
        if (fixingConfirm && value === this.state.password) {
            this.setState({
                confirm: value,
                confirmError: false
            })
        } else {
            this.setState({
                [name]: value
            });
        }
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
                    <div className="form-group">
                        <label className="mb-0" htmlFor="confirm">
                            Confirm password:
                        </label>
                        <input className="form-control"
                               placeholder="Confirm password"
                               name="confirm"
                               type="password"
                               id="confirm"
                               required
                               value={this.state.confirm}
                               onChange={this.handleChange}/>
                        {this.state.confirmError &&
                            <small id="emailHelp" class="form-text text-danger">
                                Passwords must match
                            </small>
                        }
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
