  const move = (dir, idRoom, socket) => {
    socket.emit('move', socket.id, idRoom, dir, () => { console.log('move envoye') })
  }

  const getRoomInfo = (socket, idRoom) => {
    socket.emit('getRoomInfo', idRoom)
  }

  const createRoom = (socket, profil) => {
    socket.emit('createRoom', socket.id, profil)
  }

  const joinRoom = (socket, profil, url) => {
    socket.emit('joinRoom', socket.id, profil, url)
  }

  const askToStartGame = (socket, profil, url) => {
    socket.emit('askToStartGame', socket.id, profil, url)
  }

  const leaveRoom = (socket, profil, url) => {
    socket.emit('leaveRoom', socket.id, profil, url)
  }
  const askToEndGame = (socket, url) => {
    socket.emit('askToEndGame', socket.id, url)
  }

  export default { move, getRoomInfo, createRoom, joinRoom, askToEndGame, askToStartGame, leaveRoom }