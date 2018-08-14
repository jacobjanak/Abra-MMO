/*
  Client must first join a game room using socket.io's .join() method
  then they can emit moves that will be added to their game's room.
*/

function socket(http) {
  const io = require('socket.io')(http);
  const db = require('../models');

  // const clients = {};

  io.on('connection', client => {
    // clients[client.id] = client;

    client.on('joinGame', gameId => {
      // NOTE: why is there already a room at this point?
      // if (!client.rooms || Object.keys(client.rooms).length === 0) {
      db.Game.findById(gameId)
      .then(game => {
        client.rooms = {};
        client.join(gameId)
        client.emit('gameJoined', game)
      })
    })

    client.on('move', move => {
      // NOTE: validate client.rooms length here
      const gameId = Object.keys(client.rooms)[0];

      // NOTE: validate move here

      db.Game.findById(gameId)
      .then(game => {
        game.moves.push(move)
        return game.save()
      })
      // broadcast is used instead of emit for stuff like this
      .then(game => io.to(gameId).emit('newMove', game))
    })

    // client.on('disconnect', () => {
    //   // const i = clients.indexOf(client);
    //   // if (i >= 0) clients.splice(i, 1);
    //   delete clients[client.id];
    // })
  })
}

module.exports = socket;
