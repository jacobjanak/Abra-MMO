const router = require('express').Router();
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const db = require('../models');

// create req.user and redirect logged out users
const secret = 'my secret';
const isAuthenticated = exjwt({ secret: secret });

// TEMPLATE CODE
router.post('/api/login', (req, res) => {
  db.User.findOne({ email: req.body.email })
  .then(user => {
    user.verifyPassword(req.body.password, (err, isMatch) => {
      if (isMatch && !err) {
        const token = jwt.sign({
          id: user._id,
          email: user.email,
          username: user.username
        }, secret, { expiresIn: 129600 })
        res.json({ success: true, message: 'Token issued', token: token, user: user })
      } else {
        res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' })
      }
    });
  })
  .catch(err => res.status(404).json({ success: false, message: 'User not found', error: err }))
})

router.post('/api/signup', (req, res) => {
  db.User.create(req.body)
  .then(data => res.json(data))
  .catch(err => res.status(400).json(err))
})

router.get('/api/user/:id', isAuthenticated, (req, res) => {
  db.User.findById(req.params.id)
  .then(data => {
    if (data) {
      res.json(data)
    } else {
      res.status(404).send({ success: false, message: 'No user found' })
    }
  })
  .catch(err => res.status(400).send(err))
})
// END TEMPLATE CODE

router.get('/user/', isAuthenticated, (req, res) => {
  db.User.findById(req.user.id)
  .then(data => res.json(data))
  .catch(err => res.status(404).send('No user found'))
})

router.get('/user/game', isAuthenticated, (req, res) => {
  db.Game.find({ 
    $or: [
      { player1: req.user.id }, 
      { player2: req.user.id }
    ] 
  })
  .then(game => {
    if (game) res.json(game[game.length - 1]);
    else res.status(404).send('No game found');
  })
  .catch(err => console.log(err))
})

router.get('/user/:id', (req, res) => {
  db.User.findById(req.params.id)
  .then(data => res.json(data))
  .catch(err => res.status(404).send('No user found'))
})

module.exports = router;
