const router = require('express').Router();
const db = require('../models');

router.get('/:id', (req, res) => {
  db.Game.findById(req.params.id)
  .then(data => res.json(data))
  .catch(err => console.error(err))
})

module.exports = router;
