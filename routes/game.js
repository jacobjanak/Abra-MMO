const router = require('express').Router();
const exjwt = require('express-jwt');
const db = require('../models');

// create req.user and redirect logged out users
const secret = 'my secret';
const isAuthenticated = exjwt({ secret: secret });

const queue = [];

router.get('/queue', isAuthenticated, (req, res) => {
  if (!queue.includes(req.user.id)) {
    if (queue.length > 0) {
      // NOTE: matchmaking logic here
      let game;
      const random = Math.random() >= 0.5;
      db.Game.create({
        player1: random ? req.user.id : queue.pop(),
        player2: random ? queue.pop() : req.user.id
      })
      .then(newGame => {
        game = newGame;
        return db.User.findById(game.player1)
      })
      .then(player1 => {
        player1.game = game._id;
        return player1.save();
      })
      .then(() => db.User.findById(game.player2))
      .then(player2 => {
        player2.game = game._id;
        return player2.save();
      })
      .then(game => res.json({ game: game, queued: false }))
      .catch(err => {
        console.log(err)
        res.status(500).send('Error creating game')
      })
    } else {
      queue.push(req.user.id)
      res.json({ game: null, queued: true })
    }
  }
})

// router.post('/move', (req, res) => {
//   db.Game.findById(req.body.game)
//   .then(game => {
//     game.moves.push(req.body.move)
//     return game.save()
//   })
//   .then(game => res.json(game))
//   .catch(err => res.status(404).send('Game not found'))
// })

module.exports = router;
