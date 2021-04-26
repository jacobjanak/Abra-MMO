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
        }, secret, { expiresIn: 60 * 60 * 24 * 365 })
        res.json({ success: true, message: 'Token issued', token: token, user: user })
      } else {
        res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' })
      }
    });
  })
  .catch(err => res.status(404).json({ success: false, message: 'User not found', error: err }))
})

router.post('/api/signup', (req, res) => {
  if (req.body.username.length > 12) {
    //NOTE: the message never actually gets sent
    res.status(400).send({ message: "Username cannot be more than 12 characters long" })
  }
  else if (req.body.email.length > 50) {
    res.status(400).send({ message: "Email cannot be more than 50 characters long" })
  }
  else if (req.body.username.length < 1) {
    res.status(400).send({ message: "Username cannot be less than 1 character long" })
  }
  else if (req.body.email.length < 3) {
    res.status(400).send({ message: "Email cannot be less than 3 characters long" })
  }
  else if (req.body.password.length < 1) {
    res.status(400).send({ message: "Password cannot be less than 1 characters long" })
  } 
  else if (req.body.password.length > 50) {
    res.status(400).send({ message: "Password cannot be more than 50 characters long" })
  } else {

    db.User.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.status(500).send(err))
  }
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
    winner: { $exists: false },
    $or: [
      { player1: req.user.id }, 
      { player2: req.user.id }
    ] 
  })
  .then(games => {
    //NOTE: if time is up declare winner
    if (games) res.json(games[games.length - 1]);
    else res.status(404).send('No game found');
  })
  .catch(err => console.log(err))
})

router.get('/user/:username', (req, res) => {
  db.User.findOne({ username: req.params.username })
  .then(data => res.json(data))
  .catch(err => res.status(404).send('No user found'))
})

module.exports = router;
