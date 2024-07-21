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
    url: process.env.NODE_ENV === 'production' && window.cordova ? 'https://www.diagazontal.com' : '',
    getUser: (username = '') => {
        return axios.get(API.url + '/user/' + username);
    },
    getGame: (id = '') => {
        return axios.get(API.url + '/game/' + id);
    },
    getActiveGame: () => {
        return axios.get(API.url + '/user/game');
    },
    signUpUser: user => {
        return axios.post(API.url + '/api/signup', user);
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
        if (!socket().listeners('game').length)
            socket().on('game', game => cb(game, null))

        if (!socket().listeners('newMove').length)
            socket().on('newMove', move => cb(null, move))
    },
    getPlayerCount: cb => {
        if (!socket().listeners('playerCount').length) {
            socket().emit('getPlayerCount')
            socket().on('playerCount', cb)
        }
    },
    move: move => socket().emit('move', move),
    reportTimeout: () => socket().emit('reportTimeout'),
    reportAbort: () => socket().emit('reportAbort'),
    getRankings: page => {
        return axios.get(API.url + '/users/rankings/' + page);
    },
};

export default API;
