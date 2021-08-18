module.exports = {
  move: (dir, idRoom, socket) => {
    socket.emit('move', socket.id, idRoom, dir, () => { console.log('move envoye') })
  },

  getRoomInfo: (socket, idRoom) => {
    socket.emit('getRoomInfo', idRoom)
  },

  createRoom: (socket, profil) => {
    socket.emit('createRoom', socket.id, profil)
  },

  joinRoom: (socket, profil, url) => {
    socket.emit('joinRoom', socket.id, profil, url)
  },

  askToStartGame: (socket, profil, url) => {
    socket.emit('askToStartGame', socket.id, profil, url)
  },

  leaveRoom: (socket, profil, url) => {
    socket.emit('leaveRoom', socket.id, profil, url)
  },
  askToEndGame: (socket, url) => {
    socket.emit('askToEndGame', socket.id, url)
  }
}