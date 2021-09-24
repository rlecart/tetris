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
  return (new Promise((res) => {
    socket.emit('createRoom', socket.id, profil, res)
  }))
}

const joinRoom = (socket, profil, url) => {
  return (new Promise((res) => {
    socket.emit('joinRoom', socket.id, profil, url, res)
  }))
}

const askToStartGame = (socket, url) => {
  return (new Promise((res) => {
    socket.emit('askToStartGame', socket.id, url, res)
  }))
}

const leaveRoom = (socket, url) => {
  return (new Promise((res) => {
    socket.emit('leaveRoom', socket.id, url, res)
  }))
}
const askToEndGame = (socket, url) => {
  return (new Promise((res) => {
    socket.emit('askToEndGame', socket.id, url, res)
  }))
}

module.exports = { move, getRoomInfo, createRoom, joinRoom, askToEndGame, askToStartGame, leaveRoom }