import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

class AuthService {
    user = () => {
        const token = localStorage.getItem('id_token');

        if (!token)
            return null;

        if (this.isTokenExpired(token)) {
            this.logout()
            return null;
        }

        return jwtDecode(token);
    };

    isTokenExpired = token => {
        const decoded = jwtDecode(token);
        return decoded.exp < Date.now() / 1000;
    };

    signUp = (email, password, firstName, lastName, role) => {
        return new Promise((resolve, reject) => {
            axios.post('api/signup', {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                role: role
            })
                .then(() => this.login(email, password))
                .then(user => resolve(user))
                .catch(err => reject(err))
        })
    };

    // Login via username or email
    login = (id, password) => {
        return new Promise((resolve, reject) => {
            axios.post('api/login', { id, password })
                .then(res => {
                    const { token, user } = res.data;
                    localStorage.setItem('id_token', token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    resolve(user)
                })
                .catch(err => reject(err))
        })
    };

    logout = () => {
        axios.defaults.headers.common['Authorization'] = null;
        localStorage.removeItem('id_token');
        window.location.reload()
    };
}

export default AuthService;
