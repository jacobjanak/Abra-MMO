import decode from 'jwt-decode';
import axios from 'axios';

class AuthService {
  user = () => {
    const token = localStorage.getItem('id_token');
    
    // no user is logged in
    if (!token) return false;
    
    // check if token is valid or expired
    if (!this.isTokenExpired(token)) {
      return decode(token);
    } else {
      this.logout()
    }
  };

  isTokenExpired = token => {
    const decoded = decode(token);
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

  login = (email, password) => {
    return new Promise((resolve, reject) => {
      // get token
      axios.post('api/login', {
        email: email,
        password: password
      })
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
    // clear user token and profile data from localStorage
    axios.defaults.headers.common['Authorization'] = null;
    localStorage.removeItem('id_token');
    window.location.reload()
  };
}

export default AuthService;
