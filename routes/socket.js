/*
  Client must first join a game room using socket.io's .join() method
  then they can emit moves that will be added to their game's room.
*/

const abraLogic = require('../abra-logic/');
const db = require("../models");
abraLogic.width = 39;

const clients = {};
const queue = [];

const leaveRooms = socket => {
  for (let room in socket.rooms) {
    if (socket.id !== room) {
      socket.leave(room)
    }
  }
}

function socket(http) {
  const io = require('socket.io')(http);
  const db = require('../models');

  io.on('connection', client => {
    client.on('queue', userId => {
      if (!queue.includes(userId)) {
        if (!(userId in clients)) {

          // storing the client so that we can send the game once they're queued
          clients[userId] = client;

          // store userId in the client to link between client and user
          client.userId = userId;

          // update the amount of players currently playing
          updatePlayerCount()

          if (queue.length > 0) {
            // NOTE: matchmaking logic here
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
              //NOTE: this seems excessive
              //NOTE: also very repetitive except for the last lines
              // db.Game.findById(game._id) // Do I need this?
              // .then(data => {
              //   game = data;
              //   if (game) return db.User.findById(game.player1);
              // })
              // .then(data => {
              //   game.player1 = data;
              //   return db.User.findById(game.player2)
              // })
              // .then(data => {
              //   game = data;

                // update current client
                leaveQueue(client)
                leaveRooms(client)
                client.join(game._id)
                client.emit('gameJoined', game)

                // update the opponents client
                const opponentId = game.player1 == userId ? game.player2 : game.player1;
                leaveQueue(clients[opponentId]);
                leaveRooms(clients[opponentId])
                clients[opponentId].join(game._id)
                clients[opponentId].emit('gameJoined', game)
              })
              .catch(err => console.log(err))
            // })
          } else {
            queue.push(userId)
          }
        }
      }
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
      updatePlayerCount()
    })

    client.on('disconnect', () => {
      leaveQueue(client)
      delete clients[client.userId];
      updatePlayerCount()
    })

    client.on('joinGame', data => {
      client.userId = data.userId;
      clients[client.userId] = client;
      updatePlayerCount()
      const gameId = data.gameId;
      let game;
      db.Game.findById(gameId)
      .then(data => {
        game = data;
        if (game) return db.User.findById(game.player1);
      })
      .then(data => {
        game.player1 = data;
        return db.User.findById(game.player2)
      })
      .then(data => {
        game.player2 = data;
        leaveQueue(client);
        leaveRooms(client)
        client.join(gameId)
        //NOTE: seems sketchy to send all the user data to both users
        client.emit('gameJoined', game)
      })
      .catch(err => res.status(400).send(err))
    })

    client.on('move', move => {
      // NOTE: validate client.rooms length here

      // find game
      const gameId = Object.keys(client.rooms)[1];
      db.Game.findById(gameId)
      .then(game => {
        if (!game) return false;
        if (!game.winner) {

          // make sure the client is actually a part of this game (redundant?)
          if (client.userId == game.player1 || client.userId == game.player2) {

            // validate that the correct user is sending the move (double equals is important)
            const activePlayer = client.userId == game.player1 ? 'player1' : 'player2';
            if ((game.moves.length % 2 === 0 && activePlayer === 'player1')
            || (game.moves.length % 2 === 1 && activePlayer === 'player2')) {

              // check that the move is legal
              if (abraLogic.checkLegality(move, game.moves)) {

                // add the move to the game
                game.moves.push(move)

                // update times
                const unix = new Date().getTime();
                game.time[activePlayer] -= unix - game.time.lastMove;
                game.time.lastMove = unix;

                // see if anyone ran out of time
                let winner;
                if (game.time[activePlayer] <= 0) {
                  game.time[activePlayer] = 0;
                  winner = activePlayer === 'player1' ? 'player2' : 'player1';
                } else {
                  winner = abraLogic.findWinner(game.moves);
                }

                // setting a timeout that runs after a player is out of time
                const gameId = game._id;
                if (client.rooms[gameId].timer) {
                  clearTimeout(client.rooms[gameId].timer)
                }
                // I'm using a self-calling function so that the variable
                // values are preserved when the setTimeout finally runs
                const inactivePlayer = activePlayer === 'player1' ? 'player2' : 'player1';
                (function(gameId, inactivePlayer) {
                  client.rooms[gameId].timer = setTimeout(function() {
                    outOfTime(gameId, inactivePlayer)
                  }, game.time[inactivePlayer] + 500);
                } (gameId, inactivePlayer));


                // const winner = abraLogic.findWinner(game.moves);

                // check if someone has won the game
                if (winner) {
                  game.winner = winner;
                  io.to(gameId).emit('winner', winner)

                  // add wins and losses to user objects
                  db.User.findById(game[winner])
                  .then(user => {
                    user.wins++
                    db.User.save(user)
                  })
                  db.User.findById(game[winner === 'player1' ? 'player2' : 'player1'])
                  .then(user => {
                    user.losses++
                    db.User.save(user)
                  })
                }

                return db.Game.save(game)

              // move was not legal (hacker)
              } else return false;

            // wrong user sent the move (hacker)
            } else return false;

          // user isn't a part of this game (hacker)
          } else return false;

        // game has already been finished (hacker)
        } else return false;
      })
      .then(game => {
        if (game) {
          io.to(gameId).emit('newMove', {
            move: move,
            time: game.time
          })
        }
      })
    })

    client.on('getPlayerCount', () => {
      const playerCount = Object.keys(clients).length;
      client.emit('playerCount', playerCount)
    })

    function leaveQueue(client) {
      queue.forEach((id, i) => {
        if (id === client.userId) {
          queue.splice(i, 1)
        }
      })
    }

    function updatePlayerCount() {
      const playerCount = Object.keys(clients).length;
      io.emit('playerCount', playerCount)
    }

    function outOfTime(gameId, loser) {
      db.Game.findById(gameId)
      .then(game => {
        if (game) {
          console.log("hey buddy")
          game.winner = loser === 'player1' ? 'player2' : 'player1';
          io.to(gameId).emit('winner', game.winner)
          // add wins and losses to user objects
          db.User.findById(game[game.winner])
          .then(user => {
            user.wins++
            db.User.save(user)
          })
          db.User.findById(game[loser])
          .then(user => {
            user.losses++
            db.User.save(user)
          })
        }
      })
    }
  })
}

module.exports = socket;
