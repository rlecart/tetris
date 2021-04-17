function anotherOnePlease(socket, cb) {
  socket.emit('anotherOnePlease', cb)
}

function move(dir, socket) {
  socket.emit('move', dir, () => { console.log('move envoye') })
}

// function getPlayerList(socket, idRoom) {
//   socket.emit('getPlayerList', idRoom)
// }

function createRoom(socket, profil, cb) {
  socket.emit('createRoom', profil, cb)
}

function joinRoom(socket, profil, url, cb) {
  socket.emit('joinRoom', profil, url, cb)
}

export { anotherOnePlease, move, createRoom, joinRoom }