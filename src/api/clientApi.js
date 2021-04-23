function anotherOnePlease(socket, cb) {
  socket.emit('anotherOnePlease', cb)
}

function move(dir, socket) {
  socket.emit('move', socket.id, dir, () => { console.log('move envoye') })
}

function getRoomInfo(socket, idRoom, cb) {
  socket.emit('getRoomInfo', idRoom, cb)
}

function createRoom(socket, profil, cb) {
  socket.emit('createRoom', socket.id, profil, cb)
}

function joinRoom(socket, profil, url, cb) {
  socket.emit('joinRoom', socket.id, profil, url, cb)
}

export { anotherOnePlease, move, createRoom, joinRoom, getRoomInfo }