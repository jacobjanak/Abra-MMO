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

      db.Game.findById(gameId)
      .then(game => {

        console.log(client.userId)
        console.log(game.player1)
        console.log(game.player2)
        console.log(game.moves.length)
        console.log(client.userId === game.player1)
        console.log('--------------')

        //NOTE: validate that the right user is sending this move
        if ((game.moves.length % 2 === 0 && game.player1 == client.userId)
         || (game.moves.length % 2 === 1 && game.player2 == client.userId)) {

          if (abraLogic.checkLegality(move, game.moves)) {

            // add the move to the game
            game.moves.push(move)

            // check if someone has won the game
            const winner = abraLogic.findWinner(game.moves);
            if (winner) {
              console.log(winner)
            }

            return game.save()

          // move was not legal
          } else return false;
        
        // wrong user sent the move
        } else return false;

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
