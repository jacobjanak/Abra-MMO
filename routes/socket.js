const abraLogic = require('../abra-logic/');
const db = require('../models');

abraLogic.width = 39;
const clients = {};
const queue = [];

function socket(http) {
    const io = require('socket.io')(http);

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

            const random = Math.random() >= 0.5;
            db.Game.create({
                player1: random ? userId : queue.pop(),
                player2: random ? queue.pop() : userId,
                time: {
                    player1: 5 * 60 * 1000,
                    player2: 5 * 60 * 1000
                }
            })
            .then(game => {
                // Update current client
                leaveQueue(client)
                leaveRooms(client)
                client.join(game._id)
                client.emit('gameJoined', game)

                // Update the opponents client
                const opponentId = game.player1 === userId ? game.player2 : game.player1;
                leaveQueue(clients[opponentId]);
                leaveRooms(clients[opponentId])
                clients[opponentId].join(game._id)
                clients[opponentId].emit('gameJoined', game)
            })
            .catch(err => console.log(err))
        })

        // client.on('checkIfQueued', userId => {
        //   if (queue.includes(userId)) {
        //     client.emit('isQueued', true)
        //   } else {
        //     client.emit('isQueued', false)
        //   }
        // })

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
            client.userId = data.userId; // TODO: Do I need this?
            clients[client.userId] = client; // TODO: Do I need this?
            updatePlayerCount(io)

            let game;
            db.Game.findById(data.gameId)
            .then(data => {
                game = data;
                return db.User.findById(game.player1);
            })
            .then(data => {
                game.player1 = data;
                return db.User.findById(game.player2)
            })
            .then(data => {
                game.player2 = data;

                leaveQueue(client);
                leaveRooms(client)
                client.join(data.gameId)
                client.emit('gameJoined', game)
            })
            .catch(err => res.status(400).send(err))
        })

        client.on('move', move => {
            const gameId = Object.keys(client.rooms)[1]; // TODO: this seems bad
            db.Game.findById(gameId)
                .then(game => {
                    if (!game || game.winner || (client.userId !== game.player1 && client.userId !== game.player2))
                        return;

                    const clientPlayer = client.userId === game.player1 ? 'player1' : 'player2';
                    const activePlayer = game.moves.length % 2 ? 'player2' : 'player1';
                    const inactivePlayer = activePlayer === 'player1' ? 'player2' : 'player1';

                    if (clientPlayer !== activePlayer || !abraLogic.checkLegality(move, game.moves))
                        return;

                    // Move is legal
                    game.moves.push(move)

                    // Update times
                    const unix = new Date().getTime();
                    game.time[activePlayer] -= unix - game.time.lastMove;
                    game.time.lastMove = unix;

                    // Clear the timeout that runs when a player is out of time
                    if (client.rooms[game._id].timer) {
                        clearTimeout(client.rooms[game._id].timer)
                    }

                    let winner;
                    if (game.time[activePlayer] <= 0) {
                        game.time[activePlayer] = 0;
                        winner = inactivePlayer;
                    } else {
                        winner = abraLogic.findWinner(game.moves);
                    }

                    if (winner) {
                        game.winner = winner;
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

                                finishGame(io, game, activePlayer)
                            }, game.time[inactivePlayer] + 500);
                        }(io, game, activePlayer, inactivePlayer));
                    }

                    return db.Game.save(game)
                })
                .then(game => {
                    if (game) {
                        // TODO: I don't think I have to wait for the game to finish
                        io.to(gameId).emit('newMove', {
                            move: move,
                            time: game.time,
                        })
                    }
                })
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

function leaveRooms(socket) {
    for (const room in socket.rooms) {
        if (socket.id !== room) {
            socket.leave(room)
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

    db.User.findById(game[loser])
    .then(user => {
        user.losses++;
        db.User.save(user)
    })
}

module.exports = socket;
