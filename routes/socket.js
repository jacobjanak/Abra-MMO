const { Server } = require('socket.io');
const abraLogic = require('../abra-logic/');
const db = require('../models');

abraLogic.width = 39;
const clients = {};
const queue = [];

function socket(server) {
    const io = new Server(server);

    io.on('connection', client => {

        client.on('queue', userId => {
            // Check if user already in queue or in a game
            if (queue.includes(userId) || userId in clients)
                return;

            client.userId = userId;
            clients[userId] = client;
            updatePlayerCount(io)

            if (queue.length === 0) {
                queue.push(userId);
                return;
            }

            let game;

            const random = Math.random() >= 0.5;
            db.Game.create({
                player1: random ? userId : queue.pop(),
                player2: random ? queue.pop() : userId,
                time: {
                    player1: 5 * 60 * 1000,
                    player2: 5 * 60 * 1000
                }
            })
                .then(localGame => {
                    game = localGame;
                    return db.User.findById(localGame.player1);
                })
                .then(user => {
                    user.lastGame = game._id;
                    db.User.save(user);

                    game.player1 = user;
                    return db.User.findById(game.player2);
                })
                .then(user => {
                    user.lastGame = game._id;
                    db.User.save(user);

                    game.player2 = user;

                    // Update current client
                    leaveQueue(client)
                    leaveRooms(client)
                    client.join(game._id)
                    client.emit('game', game)

                    // Update the opponents client
                    const opponentId = game.player1._id === userId ? game.player2._id : game.player1._id;
                    leaveQueue(clients[opponentId]);
                    leaveRooms(clients[opponentId])
                    clients[opponentId].join(game._id)
                    clients[opponentId].emit('game', game)
                })
                .catch(err => console.error(err))
        })

        client.on('dequeue', () => {
            leaveQueue(client)
            delete clients[client.userId];
            updatePlayerCount(io)
        })

        client.on('disconnect', () => {
            leaveQueue(client)
            delete clients[client.userId];
            updatePlayerCount(io)
        })

        client.on('getPlayerCount', () => {
            const playerCount = Object.keys(clients).length;
            client.emit('playerCount', playerCount)
        })

        client.on('joinGame', data => {
            client.userId = data.userId;
            clients[client.userId] = client;
            updatePlayerCount(io)

            let game;
            db.Game.findById(data.gameId)
                .then(localGame => {
                    game = localGame;
                    return db.User.findById(game.player1);
                })
                .then(user => {
                    game.player1 = user;
                    return db.User.findById(game.player2)
                })
                .then(user => {
                    game.player2 = user;

                    leaveQueue(client);
                    leaveRooms(client)
                    client.join(data.gameId)
                    client.emit('game', game)
                })
                .catch(err => console.error(err))
        })

        client.on('move', move => {
            const gameId = Array.from(client.rooms)[1];
            db.Game.findById(gameId)
                .then(game => {
                    if (!game || game.winner)
                        return;

                    const clientPlayer = client.userId === game.player1 ? 'player1' : 'player2';
                    const activePlayer = game.moves.length % 2 ? 'player2' : 'player1';

                    if (clientPlayer !== activePlayer)
                        return;

                    // Check for winner based on timeout
                    abraLogic.findTimeoutWinner(game);

                    if (!game.winner) {
                        // TODO: check legality

                        // Move is legal
                        game.moves.push(move)

                        // Update times
                        const now = new Date().getTime();
                        game.time[activePlayer] -= now - game.time.lastMove;
                        game.time.lastMove = now;

                        if (game.time[activePlayer] <= 0)
                            game.time[activePlayer] = 1;

                        // Check for a winner
                        abraLogic.findWinner(game);
                    }

                    if (game.winner) {
                        finishGame(io, game)
                    } else {
                        io.to(gameId).emit('newMove', {
                            move: move,
                            time: game.time,
                        })
                    }

                    db.Game.save(game)
                })
                .catch(err => console.error(err))
        })

        client.on('reportTimeout', () => {
            const gameId = Array.from(client.rooms)[1];
            db.Game.findById(gameId)
                .then(game => {
                    if (!game)
                        return;

                    if (game.winner)
                        finishGame(io, game)
                })
                .catch(err => console.error(err))
        })
    })
}

function leaveQueue(client) {
    queue.forEach((id, i) => {
        if (id === client.userId) {
            queue.splice(i, 1)
        }
    })
}

function leaveRooms(client) {
    for (const room in client.rooms) {
        if (client.id !== room) {
            client.leave(room)
        }
    }
}

function updatePlayerCount(io) {
    const playerCount = Object.keys(clients).length;
    io.emit('playerCount', playerCount)
}

function finishGame(io, game) {
    io.to(game._id).emit('game', game)

    const winner = game.winner;
    const loser = winner === 'player1' ? 'player2' : 'player1';

    db.User.findById(game[winner])
        .then(user => {
            user.wins++;
            db.User.save(user)
        })
        .catch(err => console.error(err))

    db.User.findById(game[loser])
        .then(user => {
            user.losses++;
            db.User.save(user)
        })
        .catch(err => console.error(err))
}

module.exports = socket;
