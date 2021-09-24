const move = (dir, idRoom, socket) => {
  return (new Promise((res) => {
    socket.emit('move', socket.id, idRoom, dir, res)
  }))
}

const getRoomInfo = (socket, idRoom) => {
  return (new Promise((res) => {
    socket.emit('getRoomInfo', idRoom, res)
  }))
}

const createRoom = (socket, profil) => {
  return (new Promise((res, rej) => {
    if (!socket || !socket.id)
      rej()
    socket.emit('createRoom', socket.id, profil, res)
  }))
}

const joinRoom = (socket, profil, idRoom) => {
  return (new Promise((res, rej) => {
    if (!socket || !socket.id)
      rej()
    socket.emit('joinRoom', socket.id, profil, idRoom, res)
  }))
}

const askToStartGame = (socket, idRoom) => {
  return (new Promise((res) => {
    socket.emit('askToStartGame', socket.id, idRoom, res)
  }))
}

const leaveRoom = (socket, idRoom) => {
  return (new Promise((res) => {
    socket.emit('leaveRoom', socket.id, idRoom, res)
  }))
}

const askToEndGame = (socket, idRoom) => {
  return (new Promise((res) => {
    socket.emit('askToEndGame', socket.id, idRoom, res)
  }))
}

const readyToStart = (socket, idRoom) => {
  return (new Promise((res) => {
    socket.emit('readyToStart', socket.id, idRoom, res)
  }))
}

module.exports = { move, getRoomInfo, createRoom, joinRoom, askToEndGame, askToStartGame, leaveRoom, readyToStart }