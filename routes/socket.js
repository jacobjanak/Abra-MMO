/*
  Client must first join a game room using socket.io's .join() method
  then they can emit moves that will be added to their game's room.
*/

const abraLogic = require('../abra-logic/');

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
    // client.on('queue', userId => {

    // })

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
          client.emit('gameJoined', game) 
        }
      })
    })

    client.on('move', move => {
      // NOTE: validate client.rooms length here

      const gameId = Object.keys(client.rooms)[1];

      console.log(client.userId)
      console.log('^^^^^')

      db.Game.findById(gameId)
      .then(game => {

        console.log(client.id)

        //NOTE: validate that the right user is sending this move

        if (abraLogic.checkLegality(move, game.moves)) {

          game.moves.push(move)
          const winner = abraLogic.findWinner(game.moves);
          if (winner) {
            console.log(winner)
          }
          return game.save()
        } else {
          return false;
        }
      })
      .then(game => {
        if (game) {
          io.to(gameId).emit('newMove', move)
        }
      })
    })

    // client.on('disconnect', () => {
    //   // const i = clients.indexOf(client);
    //   // if (i >= 0) clients.splice(i, 1);
    //   delete clients[client.id];
    // })
  })
}

module.exports = socket;
