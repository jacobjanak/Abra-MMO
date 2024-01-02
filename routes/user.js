const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { expressjwt: exjwt } = require('express-jwt');
const db = require('../models');

// create req.auth and redirect logged-out users
const secret = 'my secret';
const isAuthenticated = exjwt({
  secret: secret,
  algorithms: ['HS256'],
});

router.post('/api/login', (req, res) => {
  db.User.findOne('email', req.body.email)
  .then(user => {
    db.User.verifyPassword(user, req.body.password, (err, isMatch) => {
      if (err || !isMatch) {
        res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' })
        return;
      }

      const token = jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username
      }, secret, {
        expiresIn: 60 * 60 * 24 * 365
      });

      res.json({
        success: true,
        message: 'Token issued',
        token: token,
        user: user
      })
    })
  })
  .catch(() => res.status(404).json({ success: false, message: 'User not found.' }))
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
    .catch(err => res.status(400).send({ message: err }))
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
  .catch(() => res.status(404).send('No user found'))
})
// END TEMPLATE CODE

router.get('/user/', isAuthenticated, (req, res) => {
  db.User.findById(req.auth.id)
  .then(data => res.json(data))
  .catch(() => res.status(404).send('No user found'))
})

router.get('/user/game', isAuthenticated, (req, res) => {
  db.User.findById(req.auth.id)
  .then(user => {
    if (!user.lastGame)
      return Promise.reject();

    return db.Game.findById(user.lastGame)
  })
  .then(game => {
    res.json(game.winner ? null : game);
  })
  .catch(() => res.json(null))
})

router.get('/user/:username', (req, res) => {
  db.User.findOne({ username: req.params.username })
  .then(data => res.json(data))
  .catch(err => res.status(404).send('No user found'))
})

module.exports = router;
