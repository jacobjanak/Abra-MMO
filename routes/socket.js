/*
  Client must first join a game room using socket.io's .join() method
  then they can emit moves that will be added to their game's room.
*/

const abraLogic = require('../abra-logic/');

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
      //NOTE: move the user id stuff here
      if (!queue.includes(userId)) {

        // storing the client so that we can send the game once they're queued
        clients[userId] = client;

        // storing the userId in the client to create a link between clients and user objects
        client.userId = userId;

        if (queue.length > 0) {
          // NOTE: matchmaking logic here
          const random = Math.random() >= 0.5;
          db.Game.create({
            player1: random ? userId : queue.pop(),
            player2: random ? queue.pop() : userId,
          })
          .then(game => {
            //NOTE: this seems excessive
            //NOTE: also very repetitive except for the last lines
            db.Game.findById(game._id)
            .populate('player1')
            .populate('player2')
            .exec((err, game) => {
              if (err) console.log(err);
              if (game) {
                // update current client
                leaveRooms(client)
                client.join(game._id)
                client.emit('gameJoined', game)

                // update the opponents client
                const opponentId = game.player1._id == userId ? game.player2._id : game.player1._id;
                leaveRooms(clients[opponentId])
                clients[opponentId].join(game._id)
                clients[opponentId].emit('gameJoined', game)
              }
            })
          })
        } else {
          queue.push(userId)
        }
      }
    })

    client.on('joinGame', data => {
      client.userId = data.userId;
      const gameId = data.gameId;
      db.Game.findById(gameId)
      .populate('player1')
      .populate('player2')
      .exec((err, game) => {
        if (game) {
          leaveRooms(client)
          client.join(gameId)
          //NOTE: seems sketchy to send all the user data to both users
          client.emit('gameJoined', game) 
        }
      })
    })

    client.on('move', move => {
      // NOTE: validate client.rooms length here

      const gameId = Object.keys(client.rooms)[1];

      db.Game.findById(gameId)
      .then(game => {
        if (!game.winner) {

          // validate that the correct user is sending the move
          if ((game.moves.length % 2 === 0 && game.player1 == client.userId)
          || (game.moves.length % 2 === 1 && game.player2 == client.userId)) {

            // check that the move is legal
            if (abraLogic.checkLegality(move, game.moves)) {

              // add the move to the game
              game.moves.push(move)

              // check if someone has won the game
              const winner = abraLogic.findWinner(game.moves);
              if (winner) {
                game.winner = winner;
                io.to(gameId).emit('winner', winner)

                // add wins and losses to user objects
                db.User.findById(game[winner])
                .then(user => {
                  user.wins++
                  user.save()
                })
                db.User.findById(game[winner === 'player1' ? 'player2' : 'player1'])
                .then(user => {
                  user.losses++
                  user.save()
                })
              }

              return game.save()

            // move was not legal
            } else return false;
          
          // wrong user sent the move
          } else return false;

        }
      })
      .then(game => {
        if (game) {
          io.to(gameId).emit('newMove', move)
        }
      })
    })

    client.on('disconnect', () => {
      console.log(queue)
      queue.forEach((id, i) => {
        if (id === client.userId) {
          queue.splice(i, 1)
        }
      })
      console.log(queue)
      delete clients[client.id];
    })
  })
}

module.exports = socket;
