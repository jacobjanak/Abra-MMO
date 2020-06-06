import axios from 'axios';
import openSocket from 'socket.io-client';
import AuthService from './components/AuthService';

const socket = openSocket(window.location.origin);
console.log("opening a socket")
const Auth = new AuthService();

const API = {
  getUser: (username = '') => axios.get('/user/' + username),
  getGame: (id = '') => axios.get('/game/' + id),
  getActiveGame: () => axios.get('/user/game'),
  signUpUser: user => axios.post('/api/signup', user),
  queue: cb => {
    const userId = Auth.user().id;
    socket.emit('queue', userId)
    API.openSocket(cb)
  },
  dequeue: () => {
    socket.emit('dequeue')
  },
  // checkIfQueued: cb => {
  //   const userId = Auth.user().id;
  //   socket.emit('checkIfQueued', userId)
  //   socket.on('isQueued', cb)
  // },
  joinGame: (gameId, cb) => {
    API.openSocket(cb)
    const userId = Auth.user().id;
    socket.emit('joinGame', { gameId, userId })
  },
  openSocket: cb => {
    socket.on('gameJoined', game => cb(game, null, null))
    socket.on('newMove', move => cb(null, move, null))
    socket.on('winner', winner => cb(null, null, winner))
  },
  getPlayerCount: cb => {
    socket.emit('getPlayerCount')
    socket.on('playerCount', playerCount => cb(playerCount))
  },
  move: move => socket.emit('move', move)
};

export default API;
