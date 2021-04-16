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

let sioClient = undefined
let interval = undefined

const move = (dir) => {
  let reponse = -1

  if (dir === 'right')
    reponse = refresh.moveTetri(game.game, 1, 0)
  else if (dir === 'left')
    reponse = refresh.moveTetri(game.game, -1, 0)
  else if (dir === 'down')
    reponse = refresh.moveTetri(game.game, 0, 1)
  else if (dir === 'turn')
    reponse = refresh.moveTetri(game.game, 0, 0)
  if (reponse !== 0)
    sioClient.emit('refreshVue', game.game)
}

const gameLoop = () => {
  let sock = game.game
  sock = refresh.refresh(sock)
  game.game = sock
  sioClient.emit('refreshVue', sock)
}

const launchInterval = () => {
  interval = setInterval(gameLoop, 1000)
  console.log('interval init')
}

const resetInterval = (sock) => {
  game.game = sock
  clearInterval(interval)
  launchInterval()
}

const pushToClient = (req) => {
  sioClient.emit(req)
}

// let clients = {}

// const addNewClient = (add) => {
// }

const defaultRules = require('../src/ressources/rules')
let rooms = []

const createNewRoom = (profil) => {
  if (profil.id === -1)
    profil.id = rooms.length
  let room = {
    id: `${profil.id}-${new Date()}`,
    listPlayers: { ... [profil] },
    rules: defaultRules.defaultRules,
    url: 'hashed'
  }
  rooms.push(room)
  console.log(rooms)
  console.log('\n')
  console.log(profil)
}

// liste de tous les sockets serveurs
io.on('connection', (client) => {
  sioClient = client
  client.on('move', (dir) => { move(dir, sioClient) })
  client.on('createRoom', (profil) => { createNewRoom(profil) })
  client.on('startGame', launchInterval)
  client.on('endGame', () => { pushToClient('endGame') })
  console.log('connected')
})

const port = 8000;
io.listen(port);
console.log('listening on port ', port);

exports.resetInterval = resetInterval
exports.gameLoop = gameLoop
exports.pushToClient = pushToClient