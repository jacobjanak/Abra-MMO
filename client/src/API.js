import axios from 'axios';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3001');

const API = {
  // getUser: id => axios.get(`/api/user/${id}`),

  signUpUser: (username, email, password) => {
    return axios.post('/api/signup', {username: username, email: email, password: password});
  },

  subscribeToTimer: (user, cb) => {
    socket.on('timer', timestamp => cb(null, timestamp))
    socket.emit('subscribeToTimer', {
      interval: 1000,
      user: user
    })
  },

  join: id => axios.post('/game/join', { id }),

  getGame: id => axios.post('/user/game', { id }),
};

export default API;
