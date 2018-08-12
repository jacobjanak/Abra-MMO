const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');

// database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/app')

// server
const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('client/build'))

// routing
app.use('/', require('./routes/user'))

// error handling
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send(err)
  }
  else next(err);
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
