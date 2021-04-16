function anotherOnePlease(socket, cb) {
  socket.emit('anotherOnePlease', cb)
}

function move(dir, socket) {
  socket.emit('move', dir, () => { console.log('move envoye') })
}

// function getPlayerList(socket, idRoom) {
//   socket.emit('getPlayerList', idRoom)
// }

function createRoom(socket, profil) {
  socket.emit('createRoom', profil)
}

export { anotherOnePlease, move, createRoom }