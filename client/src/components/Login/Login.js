import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import AuthService from '../AuthService';
import './Login.css';

class Login extends Component {
    constructor() {
        super();
        this.Auth = new AuthService();
    }

    UNSAFE_componentWillMount() {
        if (this.Auth.user()) {
            window.location.href = '/';
        }
    }

    handleFormSubmit = event => {
        event.preventDefault();

        this.Auth.login(this.state.email, this.state.password)
            .then(user => window.location.reload())
            .catch(err => alert(err.response.data.message))
    };

    handleChange = event => {
        const {name, value} = event.target;
        this.setState({[name]: value})
    };

    render() {
        return (
            <div id="login-container" className="container">
                <h1 className="mb-3">Login</h1>
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
                        <button type="submit" className="btn btn-primary">Login</button>
                        <Link className="ml-2" to="/signup">Don't have an account?</Link>
                    </div>
                </form>
            </div>

        );
    }
}

export default Login;
