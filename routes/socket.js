function socket(http) {
  const io = require('socket.io')(http);
  const db = require('../models');

  const clients = [];

  io.on('connection', client => {
    clients.push(client)

    // join game "room"
    client.join('test')

    console.log(client.id)

    client.on('subscribeToTimer', data => {
      console.log(data.user)
      console.log('client is subscribing to timer with interval ', data.interval);
      setInterval(() => {
        io.to('test').emit('timer', new Date());
      }, data.interval);
    })

    client.on('disconnect', () => {
      const i = clients.indexOf(client);
      if (i >= 0) clients.splice(i, 1);
    })
  })
}

module.exports = socket;
