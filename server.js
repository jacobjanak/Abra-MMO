const express = require('express');
const { createServer } = require('node:http');
const path = require('node:path');
const bodyParser = require('body-parser');

// server
const PORT = process.env.PORT || 3001;
const app = express();
const server = createServer(app);

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('client/build'))

// routing
app.use('/', require('./routes/user'))
app.use('/game', require('./routes/game'))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

// socket
require('./routes/socket')(server)

// start server
server.listen(PORT, () => console.log(`http://localhost:${PORT}`))
