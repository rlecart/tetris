module.exports = {
  anotherOnePlease: (socket, cb) => {
    socket.emit('anotherOnePlease', cb)
  },

  move: (dir, idRoom, socket) => {
    socket.emit('move', socket.id, idRoom, dir, () => { console.log('move envoye') })
  },

  getRoomInfo: (socket, idRoom, cb) => {
    socket.emit('getRoomInfo', idRoom, cb)
  },

  createRoom: (socket, profil, cb) => {
    socket.emit('createRoom', socket.id, profil, cb)
  },

  joinRoom: (socket, profil, url, cb) => {
    socket.emit('joinRoom', socket.id, profil, url, cb)
  },

  askToStartGame: (socket, profil, url, cb) => {
    socket.emit('askToStartGame', socket.id, profil, url, cb)
  },

  leaveRoom: (socket, profil, url) => {
    socket.emit('leaveRoom', socket.id, profil, url)
  },
}