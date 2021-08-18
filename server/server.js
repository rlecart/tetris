const { Master } = require('./classes/Master')

let master = new Master()

<<<<<<< HEAD

let sioClientList = {}

let roomsList = {}


const { defaultRoom } = require('../src/ressources/room.js');
const { Room } = require('./classes/Room')

const createRoom = (clientId, profil, cb) => {
  if (profil.name) {
    let room = new Room()
    // let room = clonedeep(defaultRoom)
    room.setUrl(utils.createNewUrl(roomsList))
    roomsList = { ...roomsList, [room.getUrl()]: room }
    // console.log(room)
    // console.log('\n', roomsList)
    joinRoom(clientId, profil, room.getUrl(), cb)

    //Bidouille Pacome
    return (room)
  }
}

const getSocketClientListFromRoom = (url, objVersion) => {
  let ret = objVersion ? {} : []

  if (roomsList && roomsList[url] && roomsList[url].getListPlayers()) {
    for (let [key, value] of Object.entries(roomsList[url].getListPlayers())) {
      if (objVersion)
        ret = { ...ret, [key]: sioClientList[key] }
      else
        ret.push(sioClientList[key])
    }
  }
  return ret
}

const emitAll = (message, target, except, obj, spec) => {
  let clientList = target ? getSocketClientListFromRoom(target, true) : sioClientList

  console.log(clientList)
  for (let [key, value] of Object.entries(clientList)) {
    if (key !== except) {
      value.emit(message, obj, spec)
    }
  }
}

const emitOnly = (message, target, only, obj, spec) => {
  let clientList = getSocketClientListFromRoom(target, true)

  for (let [key, value] of Object.entries(clientList)) {
    if (key === only)
      value.emit(message, obj, spec)
  }
}

const joinRoom = (clientId, profil, url, cb) => {
  if (roomsList && roomsList[url] && profil.name && !roomsList[url].getInGame() && !roomsList[url].getListPlayers(clientId) && roomsList[url].getNbPlayer() < 8) {
    // console.log('joinroom')
    roomsList[url].addNewPlayer(clientId, profil)
    cb(`/#${url}[${profil.name}]`)
    //emitAll('refreshRoomInfo', url, clientId, roomsList[url].getRoomInfo())
  }
}

const move = (clientId, url, dir) => {
  let reponse = -1

  if (dir === 'right')
    reponse = refresh.moveTetri(roomsList[url].getListPlayers(clientId).getGame(), 1, 0)
  else if (dir === 'left')
    reponse = refresh.moveTetri(roomsList[url].getListPlayers(clientId).getGame(), -1, 0)
  else if (dir === 'down')
    reponse = refresh.moveTetri(roomsList[url].getListPlayers(clientId).getGame(), 0, 1)
  else if (dir === 'turn')
    reponse = refresh.moveTetri(roomsList[url].getListPlayers(clientId).getGame(), 0, 0)
  if (reponse !== 0)
    emitOnly('refreshVue', url, clientId, roomsList[url].getListPlayers(clientId).getGame(), roomsList[url].createSpecList(roomsList[url].getListPlayers(clientId).getGame(), url))
}

let gameRooms = {}



const closeRoom = (room) => {
  let clientsRoom = getSocketClientListFromRoom(room.getUrl(), true)

  room.endGame()
  for (let [key, value] of Object.entries(clientsRoom)) {
    roomsList[room.getUrl()][key] = undefined
    room.resetUrl()
  }
  roomsList[room.getUrl()] = undefined
  console.log(`room ${room.getUrl()} closed`)
}


const startGame = (clientId, profil, url, cb) => {
  if (roomsList && roomsList[url]) {
    emitAll('goToGame', url, undefined, undefined)
  }
}

const tryToStart = (clientsRTS, nbPlayers) => {
  let i = 0

  for (let client in clientsRTS) // a changer pour iter sur obj ? pas besoin car juste besoin de compter ?
    i++
  if (i === nbPlayers)
    return true
  return false
}

let roomsRTS = {}

const readyToStart = (clientId, url) => {
  let res
  const room = roomsList[url]
  if (url && clientId && room.getListPlayers(clientId)) {
    room.addReadyToStart(clientId)
    if (res = tryToStart(room.getReadyToStart(), room.getNbPlayer())) {
      room.startGame()
    }
  }
}

// liste de tous les sockets serveurs
io.on('connection', (client) => {
  sioClientList = { ...sioClientList, [client.id]: client }
  // console.log(sioClientList)
  client.on('move', (clientId, url, dir) => {
    console.log('move x1\n\n')
    if (roomsList[url].getInGame())
      move(clientId, url, dir)
  })
  client.on('createRoom', (clientId, profil, cb) => { createRoom(clientId, profil, cb) })
  client.on('joinRoom', (clientId, profil, url, cb) => { joinRoom(clientId, profil, url, cb) })
  client.on('getRoomInfo', (idRoom, cb) => { roomsList[idRoom].getRoomInfo(cb) })
  client.on('startGame', (clientId, profil, url, cb) => { startGame(clientId, profil, url, cb) })
  client.on('readyToStart', (clientId, url) => { readyToStart(clientId, url) })
  client.conn.on('heartbeat', () => {
    console.log('heartbeat called!');
    sioClientList[client.id].hbeat = Date.now();
    setTimeout(function () {
      var now = Date.now();
      if (now - sioClientList[client.id].hbeat > 5000) {
        console.log('this client id will be closed ' + client.id);
        if (1) {
          // removeFromLobby(client.id);

          try {
            // this is the most important part
            console.log(io.clients, '\n')
            io.clients.connected[client.id].disconnect();
          } catch (error) {
            console.log(error)
          }
        }
      }
      now = null;
    }, 6000);
  });

  console.log('connected')
})

const port = 8000;
io.listen(port);
console.log('listening on port ', port);

const stopserver = () => { process.exit() }

exports.stopserver = stopserver
exports.createRoom = createRoom
exports.joinRoom = joinRoom
exports.closeRoom = closeRoom
exports.emitAll = emitAll
exports.emitOnly = emitOnly
exports.getSocketClientListFromRoom = getSocketClientListFromRoom
=======
master.startServer()
>>>>>>> d1ec61fa95fd18b49233dbb9300bf69030a70b88
