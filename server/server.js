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

const move = (dir, client) => {
  if (dir === 'right')
    refresh.moveTetri(game.game, 1, 0)
  else if (dir === 'left')
    refresh.moveTetri(game.game, -1, 0)
  else if (dir === 'down')
    refresh.moveTetri(game.game, 0, 1)
  client.emit('refreshVue', game.game)
}

// liste de tous les sockets serveurs
io.on('connection', (client) => {
  client.on('move', (dir) => { move(dir, client) })
  client.on('start', () => {
    console.log('game started')
    interval = setInterval(() => {
      let sock = game.game
      refresh.refresh(sock)
      client.emit('refreshVue', sock)
    }, 500);
  })
  console.log('connected')
})


const port = 8000;
io.listen(port);
console.log('listening on port ', port);
