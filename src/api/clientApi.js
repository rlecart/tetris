const anotherOnePlease = (socket, cb) => {
  socket.emit('anotherOnePlease', cb)
}

const move = (dir, idRoom, socket) => {
  socket.emit('move', socket.id, idRoom, dir, () => { console.log('move envoye') })
}

const getRoomInfo = (socket, idRoom, cb) => {
  socket.emit('getRoomInfo', idRoom, cb)
}

const createRoom = (socket, profil, cb) => {
  socket.emit('createRoom', socket.id, profil, cb)
}

const joinRoom = (socket, profil, url, cb) => {
  socket.emit('joinRoom', socket.id, profil, url, cb)
}

const askToStartGame = (socket, profil, url, cb) => {
  socket.emit('askToStartGame', socket.id, profil, url, cb)
}

export { anotherOnePlease, move, createRoom, joinRoom, getRoomInfo, askToStartGame }