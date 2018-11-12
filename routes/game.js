const router = require('express').Router();
const exjwt = require('express-jwt');
const db = require('../models');

// create req.user and redirect logged out users
const secret = 'my secret';
const isAuthenticated = exjwt({ secret: secret });

const queue = [];

router.get('/queue', isAuthenticated, (req, res) => {
  // make sure they aren't already queued
  if (!queue.includes(req.user.id)) {
    if (queue.length > 0) {
      // NOTE: matchmaking logic here
      let game;
      const random = Math.random() >= 0.5;
      db.Game.create({
        player1: random ? req.user.id : queue.pop(),
        player2: random ? queue.pop() : req.user.id,
      })
      .then(game => res.json({ game: game, queued: false }))
      .catch(err => res.status(500).send('Error creating game'))
    } else {
      queue.push(req.user.id)
      res.json({ game: null, queued: true })
    }
  }
})

module.exports = router;
