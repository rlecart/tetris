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


let sioClientList = {}
let interval = undefined

const move = (clientId, dir) => {
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
    sioClientList.emit('refreshVue', game.game)
}

const gameLoop = () => {
  let sock = game.game
  sock = refresh.refresh(sock)
  game.game = sock
  sioClientList.emit('refreshVue', sock)
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
  sioClientList.emit(req)
}

let rooms = {}

const generateUrl = () => {
  return (Math.random().toString(36).substring(7))
}

const createNewUrl = (roomsList) => {
  let url = generateUrl()
  while (roomsList[url])
    url = generateUrl()
  return (url)
}

const { defaultRoom } = require('../src/ressources/room.js');

const createRoom = (clientId, profil, cb) => {
  if (profil.name) {
    let room = defaultRoom
    room.url = createNewUrl(rooms)
    room.nbPlayer++
    rooms = { ...rooms, [room.url]: { ...room } }
    console.log(room)
    // console.log('\n', rooms)
    joinRoom(clientId, profil, room.url, cb)
  }
}

const getClientListFromRoom = (roomUrl) => {
  let ret = []

  if (rooms && rooms[roomUrl] && rooms[roomUrl].listPlayers) {
    for (let [key, value] of Object.entries(rooms[roomUrl].listPlayers)) {
      ret.push(sioClientList[key])
    }
  }
  return ret
}

const emitAll = (message, target, except, obj) => {
  let clientList = target ? getClientListFromRoom(target) : sioClientList

  for (let [key, value] of Object.entries(clientList)) {
    if (key !== except) {
      value.emit(message, obj)
    }
  }
}

const joinRoom = (clientId, profil, url, cb) => {
  if (rooms[url] && profil.name && !rooms[url].listPlayers[clientId] && rooms[url].nbPlayer < 8) {
    rooms[url].listPlayers = { ...rooms[url].listPlayers, [clientId]: profil }
    rooms[url].nbPlayer++
    console.log(rooms, '\n')
    cb(`/#${url}[${profil.name}]`)
    emitAll('refreshRoomInfo', url, clientId, getRoomInfo(url))
  }
}

const getArrayFromObject = (obj) => {
  let ret = []

  for (let [key, value] of Object.entries(obj))
    ret.push(value)
  return ret
}

const getRoomInfo = (idRoom, cb) => {
  let roomInfo

  if (rooms && rooms[idRoom]) {
    roomInfo = { ...rooms[idRoom], listPlayers: getArrayFromObject(rooms[idRoom].listPlayers) }
    console.log('getRoomInfo', roomInfo)
    if (cb)
      cb(roomInfo)
    else
      return roomInfo
  }
}

// liste de tous les sockets serveurs
io.on('connection', (client) => {
  sioClientList = { ...sioClientList, [client.id]: client }
  // console.log(sioClientList)
  client.on('move', (clientId, dir) => { move(clientId, dir, sioClientList) })
  client.on('createRoom', (clientId, profil, cb) => { createRoom(clientId, profil, cb) })
  client.on('joinRoom', (clientId, profil, url, cb) => { joinRoom(clientId, profil, url, cb) })
  client.on('getRoomInfo', (idRoom, cb) => { getRoomInfo(idRoom, cb) })
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