  const move = (dir, idRoom, socket) => {
    socket.emit('move', socket.id, idRoom, dir)
  }

  const getRoomInfo = (socket, idRoom, cb) => {
    socket.emit('getRoomInfo', idRoom, cb)
  }

  const createRoom = (socket, profil) => {
    socket.emit('createRoom', socket.id, profil)
  }

  const joinRoom = (socket, profil, url) => {
    socket.emit('joinRoom', socket.id, profil, url)
  }

  const askToStartGame = (socket, url) => {
    socket.emit('askToStartGame', socket.id, url)
  }

  const leaveRoom = (socket, profil, url) => {
    socket.emit('leaveRoom', socket.id, profil, url)
  }
  const askToEndGame = (socket, url) => {
    socket.emit('askToEndGame', socket.id, url)
  }

  module.exports = { move, getRoomInfo, createRoom, joinRoom, askToEndGame, askToStartGame, leaveRoom }