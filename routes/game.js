const router = require('express').Router();
const db = require('../models');

router.get('/:id', (req, res) => {
  // make sure they aren't already queued
  db.Game.findById(req.params.id)
  .then(data => res.json(data))
  .catch(err => res.status(404).send('No game found'))
})
//
module.exports = router;
