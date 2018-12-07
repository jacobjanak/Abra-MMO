const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');

// database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/abra';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

// server
const PORT = process.env.PORT || 3001;
const app = express();
const http = require('http').Server(app);

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('client/build'))
app.use(morgan('dev'))

// routing
app.use('/', require('./routes/user'))
app.use('/game', require('./routes/game'))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

// socket
require('./routes/socket')(http)

// start server
http.listen(PORT, () => console.log(`http://localhost:${PORT}`))
