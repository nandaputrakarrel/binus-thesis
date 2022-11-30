const io = require('socket.io')(process.env.PORT_SOCKET, {
  cors: {
    origin: process.env.CORS_WHITELIST.split(','),
    methods: process.env.CORS_METHODS.split(','),
  },
});

console.log({
  status: 'IO Ready',
});

io.on('connection', function() {
  io.emit('IO Connected');
  console.log('IO Connected');
});

module.exports = io;
