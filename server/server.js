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
const clonedeep = require('lodash.clonedeep')


let sioClientList = {}

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
    let room = clonedeep(defaultRoom)
    room.url = createNewUrl(rooms)
    rooms = { ...rooms, [room.url]: { ...room } }
    // console.log(room)
    // console.log('\n', rooms)
    joinRoom(clientId, profil, room.url, cb)
  }
}

const getClientListFromRoom = (url, objVersion) => {
  let ret = objVersion ? {} : []

  if (rooms && rooms[url] && rooms[url].listPlayers) {
    for (let [key, value] of Object.entries(rooms[url].listPlayers)) {
      if (objVersion)
        ret = { ...ret, [key]: sioClientList[key] }
      else
        ret.push(sioClientList[key])
    }
  }
  return ret
}

const emitAll = (message, target, except, obj) => {
  let clientList = target ? getClientListFromRoom(target, true) : sioClientList

  for (let [key, value] of Object.entries(clientList)) {
    if (key !== except) {
      value.emit(message, obj)
    }
  }
}

const emitOnly = (message, clientId, target, obj) => {
  let clientList = getClientListFromRoom(target, true)

  for (let [key, value] of Object.entries(clientList)) {
    if (key === clientId)
      value.emit(message, obj)
  }
}

const joinRoom = (clientId, profil, url, cb) => {
  if (!rooms[url].inGame && rooms[url] && profil.name && !rooms[url].listPlayers[clientId] && rooms[url].nbPlayer < 8) {
    console.log('joinroom')
    rooms[url].listPlayers = { ...rooms[url].listPlayers, [clientId]: profil }
    rooms[url].nbPlayer++
    // console.log(rooms, '\n')
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
    // console.log('getRoomInfo', roomInfo)
    if (cb)
      cb(roomInfo)
    else
      return roomInfo
  }
}
const move = (clientId, url, dir) => {
  let reponse = -1

  if (dir === 'right')
    reponse = refresh.moveTetri(gameRooms[url][clientId], 1, 0)
  else if (dir === 'left')
    reponse = refresh.moveTetri(gameRooms[url][clientId], -1, 0)
  else if (dir === 'down')
    reponse = refresh.moveTetri(gameRooms[url][clientId], 0, 1)
  else if (dir === 'turn')
    reponse = refresh.moveTetri(gameRooms[url][clientId], 0, 0)
  if (reponse !== 0)
    emitOnly('refreshVue', clientId, url, gameRooms[url][clientId])
}

let gameRooms = {}

const gameLoop = (clientsRoom, url) => {

  for (let [key, value] of Object.entries(clientsRoom)) {
    console.log('key=', key)
    // console.log('value=', value)
    if (gameRooms[url][key] === undefined) {
      gameRooms[url] = {
        ...gameRooms[url], [key]: {
          ...clonedeep(game.game)
        },
      }
    }
    gameRooms[url][key] = refresh.refresh(gameRooms[url][key], gameRooms[url])
  }
  for (let [key, value] of Object.entries(clientsRoom))
    if (gameRooms && gameRooms[url] && gameRooms[url][key]) {
      value.emit('refreshVue', gameRooms[url][key])
    }
  // console.log('\n\n\n', gameRooms, gameRooms[url], '\n\n\n')
}



const closeRoom = (room) => {
  let clientsRoom = getClientListFromRoom(url, true)

  clearInterval(room.interval)
  room.inGame = false
  for (let [key, value] of Object.entries(clientsRoom)) {
    room[key] = undefined
  }
  console.log(room)
}

const launchInterval = (url, room) => {
  let clientsRoom = getClientListFromRoom(url, true)
  room.interval = setInterval(gameLoop, 1000, clientsRoom, url)
  console.log(`interval ${url} init`)
}

const startGame = (clientId, profil, url, cb) => {
  console.log(profil, url)
  if (rooms && rooms[url]) {
    rooms[url].inGame = true
    emitAll('goToGame', url, undefined, undefined)
  }
}

const tryToStart = (clientsRTS, nbPlayers) => {
  let i = 0

  for (let client in clientsRTS)
    i++
  if (i === nbPlayers)
    return true
  return false
}

let roomsRTS = {}

const readyToStart = (clientId, url) => {
  let res
  // console.log('aaaaa', url, clientId, rooms[url], rooms[url].listPlayers[clientId])
  if (url && clientId && rooms[url].listPlayers[clientId]) {
    roomsRTS = {
      ...roomsRTS, [url]: {
        ...roomsRTS[url], [clientId]: true
      }
    }
    if (res = tryToStart(roomsRTS[url], rooms[url].nbPlayer)) {
      gameRooms = {
        ...gameRooms,
        [url]: {
          interval: undefined,
          shapes: [],
          shapesId: [],
        },
      }
      refresh.initShapes(gameRooms[url])
      rooms[url].inGame = true
      launchInterval(url, gameRooms[url])
      roomsRTS[url] = undefined
    }
  }
  console.log(res)
}

// liste de tous les sockets serveurs
io.on('connection', (client) => {
  sioClientList = { ...sioClientList, [client.id]: client }
  // console.log(sioClientList)
  client.on('move', (clientId, url, dir) => { move(clientId, url, dir) })
  client.on('createRoom', (clientId, profil, cb) => { createRoom(clientId, profil, cb) })
  client.on('joinRoom', (clientId, profil, url, cb) => { joinRoom(clientId, profil, url, cb) })
  client.on('getRoomInfo', (idRoom, cb) => { getRoomInfo(idRoom, cb) })
  client.on('startGame', (clientId, profil, url, cb) => { startGame(clientId, profil, url, cb) })
  client.on('readyToStart', (clientId, url) => { readyToStart(clientId, url) })
  client.on('endGame', () => { pushToClient('endGame') })
  console.log('connected')
})

const port = 8000;
io.listen(port);
console.log('listening on port ', port);

exports.closeRoom = closeRoom
exports.gameLoop = gameLoop
exports.emitAll = emitAll