const http = require('http')
const server = http.createServer();
const socketio = require('socket.io')
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});
const game = require('../src/ressources/game.js')
const refresh = require('./refresh.js')

io.on('connection', (client) => {
  // liste de tous les sockets serveurs
  client.on('anotherOnePlease', () => {
    console.log('Une autre stp')
  })
  client.on('start', () => {
    console.log('game started')
    setInterval(() => {
      refresh(game)
      client.emit('refreshVue', game)
    }, 1000);
  })
  console.log('connected')
})


const port = 8000;
io.listen(port);
console.log('listening on port ', port);
