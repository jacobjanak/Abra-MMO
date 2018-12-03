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
  queue: cb => {
    const userId = Auth.user().id;
    socket.emit('queue', userId)
    socket.on('gameJoined', game => cb(game, null, null))
    socket.on('newMove', move => cb(null, move, null))
    socket.on('winner', winner => cb(null, null, winner))
  },
  getGame: () => axios.get('/user/game'),

  joinGame: (gameId, cb) => {
    const userId = Auth.user().id;
    socket.emit('joinGame', { gameId, userId })
    socket.on('gameJoined', game => cb(game, null, null))
    socket.on('newMove', move => cb(null, move, null))
    socket.on('winner', winner => cb(null, null, winner))
    // const userId = Auth.user().id;
    // socket.emit('joinGame', { gameId, userId })
    // socket.on('gameJoined', game => cb(game, null, null))
    // socket.on('newMove', move => cb(null, move, null))
    // socket.on('winner', winner => cb(null, null, winner))
  },

  move: move => socket.emit('move', move),
};

export default API;
