const router = require('express').Router();
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const db = require('../models');

const secret = 'my secret';
const isAuthenticated = exjwt({ secret: secret });

router.post('/api/login', (req, res) => {
  db.User.findOne({
    email: req.body.email
  })
  .then(user => {
    user.verifyPassword(req.body.password, (err, isMatch) => {
      if (isMatch && !err) {
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: 129600 })
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

router.get('/', isAuthenticated, (req, res) => {
  res.send('You are authenticated')
})

module.exports = router;
