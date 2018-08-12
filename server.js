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
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('client/build'))
app.use(morgan('dev'))

// routing
// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
})

app.use('/', require('./routes/user'))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

// socket
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', client => {
  console.log(client.id)
  client.on('subscribeToTimer', conn => {
    console.log(conn.user)
    console.log('client is subscribing to timer with interval ', conn.interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, conn.interval);
  })
})

// io.listen(PORT);

http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
