/*
  Client must first join a game room using socket.io's .join() method
  then they can emit moves that will be added to their game's room.
*/

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

    client.on('joinGame', gameId => {
      console.log(gameId)
      console.log('^^^^^^^^^^^^^^')
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
      console.log(move)
      console.log(client.rooms)
      const gameId = Object.keys(client.rooms)[1];

      // NOTE: validate move here

      db.Game.findById(gameId)
      .then(game => {
        game.moves.push(move)
        return game.save()
      })
      .then(game => {
        io.to(gameId).emit('newMove', move)
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
