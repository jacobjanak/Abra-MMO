const abraLogic = require('../abra-logic/');
const db = require('../models');

abraLogic.width = 39;
const clients = {};
const queue = [];

function socket(http) {
    const io = require('socket.io')(http);

    io.on('connection', client => {

        client.on('queue', userId => {
            console.log('queue')

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
                // TODO: do both user lookups at the same time
                return db.User.findById(localGame.player1);
            })
            .then(user => {
                game.player1 = user;
                return db.User.findById(game.player2)
            })
            .then(user => {
                game.player2 = user;

                // Update current client
                leaveQueue(client)
                leaveRooms(client)
                client.join(game._id)
                client.emit('gameJoined', game)

                // Update the opponents client
                const opponentId = game.player1._id === userId ? game.player2._id : game.player1._id;
                leaveQueue(clients[opponentId]);
                leaveRooms(clients[opponentId])
                clients[opponentId].join(game._id)
                clients[opponentId].emit('gameJoined', game)
            })
            .catch(err => console.log(err))
        })

        // client.on('checkIfQueued', userId => {
        //   console.log('checkIfQueued')
        //   if (queue.includes(userId)) {
        //     client.emit('isQueued', true)
        //   } else {
        //     client.emit('isQueued', false)
        //   }
        // })

        client.on('dequeue', () => {
            console.log('dequeue')

            leaveQueue(client)
            delete clients[client.userId];
            updatePlayerCount(io)
        })

        client.on('disconnect', () => {
            console.log('disconnect')

            leaveQueue(client)
            delete clients[client.userId];
            updatePlayerCount(io)
        })

        client.on('getPlayerCount', () => {
            console.log('getPlayerCount')

            const playerCount = Object.keys(clients).length;
            client.emit('playerCount', playerCount)
        })

        client.on('joinGame', data => {
            console.log('joinGame')

            client.userId = data.userId; // TODO: Do I need this?
            clients[client.userId] = client; // TODO: Do I need this?
            updatePlayerCount(io)

            let game;
            db.Game.findById(data.gameId)
            .then(localGame => {
                game = localGame;
                // TODO: do both user lookups at the same time
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
                client.emit('gameJoined', game)
            })
            .catch(err => console.error(err))
        })

        client.on('move', move => {
            console.log('move')

            const gameId = Object.keys(client.rooms)[1];
            db.Game.findById(gameId)
            .then(game => {
                if (!game || game.winner)
                    return;

                const clientPlayer = client.userId === game.player1 ? 'player1' : 'player2';
                const activePlayer = game.moves.length % 2 ? 'player2' : 'player1';
                const inactivePlayer = activePlayer === 'player1' ? 'player2' : 'player1';

                if (clientPlayer !== activePlayer)
                    return;

                // Move is legal
                game.moves.push(move)
                game.time.lastMove = new Date().getTime();

                // Clear the timeout that runs when a player is out of time
                if (client.rooms[game._id].timer) {
                    clearTimeout(client.rooms[game._id].timer)
                }

                // Check for a winner
                const winner = abraLogic.findWinner(game);

                if (winner) {
                    finishGame(io, game, winner)
                } else {
                    // TODO: this can be improved
                    // Set a timeout that will run when the player runs out of time
                    // Using self-calling function for scoping so that the variables don't get overwritten
                    (function (io, game, activePlayer, inactivePlayer) {
                        client.rooms[gameId].timer = setTimeout(function () {
                            db.Game.findById(gameId)
                            .then(game => {
                                game.winner = winner;
                                db.Game.save(game)
                            })
                            .catch(err => console.error(err))

                            finishGame(io, game, activePlayer)
                        }, game.time[inactivePlayer] + 500);
                    }(io, game, activePlayer, inactivePlayer));
                }

                io.to(gameId).emit('newMove', {
                    move: move,
                    time: game.time,
                })

                db.Game.save(game)
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

function finishGame(io, game, winner) {
    const loser = winner === 'player1' ? 'player2' : 'player1';

    io.to(game._id).emit('winner', winner)

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
