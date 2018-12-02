import axios from 'axios';
import openSocket from 'socket.io-client';
import AuthService from './components/AuthService';

const socket = openSocket(window.location.origin);
const Auth = new AuthService();

const API = {
  getUser: (id = '') => axios.get('/user/' + id),
  signUpUser: (username, email, password) => {
    return axios.post('/api/signup', {username: username, email: email, password: password});
  },
  queue: () => axios.get('/game/queue'),
  getGame: () => axios.get('/user/game'),

  joinGame: (gameId, cb) => {
    const userId = Auth.user().id;
    socket.emit('joinGame', { gameId, userId })
    socket.on('gameJoined', game => cb(game, null))
    socket.on('newMove', move => cb(null, move))
  },

  move: move => socket.emit('move', move),
};

export default API;
