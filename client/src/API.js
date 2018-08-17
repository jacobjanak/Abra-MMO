import axios from 'axios';
import openSocket from 'socket.io-client';

const socket = openSocket(window.location.origin);

const API = {
  getUser: (id = '') => axios.get('/user/' + id),
  signUpUser: (username, email, password) => {
    return axios.post('/api/signup', {username: username, email: email, password: password});
  },
  queue: () => axios.get('/game/queue'),
  getGame: () => axios.get('/user/game'),

  joinGame: (gameId, cb) => {
    socket.emit('joinGame', gameId)
    socket.on('gameJoined', game => cb(game, null))
    socket.on('newMove', move => cb(null, move))
  },

  move: move => socket.emit('move', move),

  // subscribeToTimer: (user, cb) => {
  //   socket.on('timer', timestamp => cb(null, timestamp))
  //   socket.emit('subscribeToTimer', {
  //     interval: 1000,
  //     user: user
  //   })
  // },
};

export default API;
