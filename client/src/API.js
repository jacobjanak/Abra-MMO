import axios from 'axios';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3001');

const API = {
  // Gets a single user by id
  getUser: (id) => {
    return axios.get(`/api/user/${id}`);
  },
  // sign up a user to our service
  signUpUser: (username, email, password) => {
    return axios.post('api/signup', {username: username, email: email, password: password});
  },

  subscribeToTimer: (user, cb) => {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', {
      interval: 1000,
      user: user
    });
  }
};

export default API;
