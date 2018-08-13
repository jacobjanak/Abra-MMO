const router = require('express').Router();
const db = require('../models');

const queue = [];

router.post('/join', (req, res) => {
  if (queue.length > 0) {
    let game;
    const random = Math.random() >= 0.5;
    db.Game.create({
      player1: random ? req.body.id : queue.pop(),
      player2: random ? queue.pop() : req.body.id
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
    queue.push(req.body.id)
    res.json({ game: null, queued: true })
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
