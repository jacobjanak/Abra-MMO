import axios from 'axios';
import openSocket from 'socket.io-client';
import AuthService from './components/AuthService';

const Auth = new AuthService();

function socket() {
    if (socket.instance)
        return socket.instance;

    socket.instance = openSocket(window.location.origin);
    return socket.instance;
}

const API = {
    getUser: (username = '') => {
        return axios.get('/user/' + username);
    },
    getGame: (id = '') => {
        return axios.get('/game/' + id);
    },
    getActiveGame: () => {
        return axios.get('/user/game');
    },
    signUpUser: user => {
        return axios.post('/api/signup', user);
    },
    queue: cb => {
        const userId = Auth.user().id;
        socket().emit('queue', userId)
        API.openSocket(cb)
    },
    dequeue: () => {
        socket().emit('dequeue')
    },
    joinGame: (gameId, cb) => {
        API.openSocket(cb)
        const userId = Auth.user().id;
        socket().emit('joinGame', {
            gameId,
            userId
        })
    },
    openSocket: cb => {
        socket().on('gameJoined', game => cb(game, null, null))
        socket().on('newMove', move => cb(null, move, null))
        socket().on('winner', winner => cb(null, null, winner))
    },
    getPlayerCount: cb => {
        socket().emit('getPlayerCount')
        socket().on('playerCount', playerCount => cb(playerCount))
    },
    move: move => socket().emit('move', move)
};

export default API;
