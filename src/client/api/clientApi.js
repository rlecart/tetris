const move = (dir, idRoom, socket) => {
  return (new Promise((res, rej) => {
    if (socket && socket.connected && socket.id)
      socket.emit('move', socket.id, idRoom, dir, (reponse) => {
        if (reponse && reponse.type === 'ok')
          res();
        else
          rej(reponse.value);
      });
    else
      rej('socket not connected');
  }));
};

const getRoomInfo = (socket, idRoom) => {
  return (new Promise((res, rej) => {
    if (socket && socket.connected && socket.id) {
      socket.emit('getRoomInfo', idRoom, (reponse) => {
        if (reponse && reponse.type === 'ok')
          res(reponse.value);
        else
          rej(reponse.value);
      });
    }
    else
      rej('socket not connected');
  }));
};

const createRoom = (socket, profil) => {
  return (new Promise((res, rej) => {
    if (socket && socket.connected && socket.id) {
      socket.emit('createRoom', socket.id, profil, (reponse) => {
        if (reponse && reponse.type === 'ok')
          res(reponse.value);
        else
          rej(reponse.value);
      });
    }
    else
      rej('socket not connected');
  }));
};

const joinRoom = (socket, profil, idRoom) => {
  return (new Promise((res, rej) => {
    if (socket && socket.connected && socket.id) {
      socket.emit('joinRoom', socket.id, profil, idRoom, (reponse) => {
        if (reponse && reponse.type === 'ok')
          res(reponse.value);
        else
          rej(reponse.value);
      });
    }
    else
      rej('socket not connected');
  }));
};

const askToStartGame = (socket, idRoom) => {
  return (new Promise((res, rej) => {
    if (socket && socket.connected && socket.id)
      socket.emit('askToStartGame', socket.id, idRoom, (reponse) => {
        if (reponse && reponse.type === 'ok')
          res();
        else
          rej(reponse.value);
      });
    else
      rej('socket not connected');
  }));
};

const leaveRoom = (socket, idRoom) => {
  return (new Promise((res, rej) => {
    if (socket && socket.connected && socket.id)
      socket.emit('leaveRoom', socket.id, idRoom, (reponse) => {
        if (reponse && reponse.type === 'ok')
          res();
        else
          rej(reponse.value);
      });
    else
      rej('socket not connected');
  }));
};

const askToEndGame = (socket, idRoom) => {
  return (new Promise((res, rej) => {
    if (socket && socket.connected && socket.id)
      socket.emit('askToEndGame', socket.id, idRoom, res);
    else
      rej('socket not connected');
  }));
};

const readyToStart = (socket, idRoom) => {
  return (new Promise((res, rej) => {
    if (socket && socket.connected && socket.id)
      socket.emit('readyToStart', socket.id, idRoom, res);
    else
      rej('socket not connected');
  }));
};

const askEverybodyToCalmDown = (socket, idRoom) => {
  return (new Promise((res, rej) => {
    if (socket && socket.connected && socket.id)
      socket.emit('askEverybodyToCalmDown', socket.id, idRoom, (reponse) => {
        if (reponse && reponse.type === 'ok')
          res();
        else
          rej(reponse.value);
      });
    else
      rej('socket not connected');
  }));
};

export default { move, getRoomInfo, createRoom, joinRoom, askToEndGame, askToStartGame, leaveRoom, readyToStart, askEverybodyToCalmDown };