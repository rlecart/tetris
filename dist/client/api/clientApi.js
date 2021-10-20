'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var move = function move(dir, idRoom, socket) {
  return new Promise(function (res, rej) {
    if (socket && socket.connected && socket.id) socket.emit('move', socket.id, idRoom, dir, res);else rej('socket not connected');
  });
};

var getRoomInfo = function getRoomInfo(socket, idRoom) {
  return new Promise(function (res, rej) {
    if (socket && socket.connected && socket.id) {
      socket.emit('getRoomInfo', idRoom, function (reponse) {
        if (reponse && reponse.type === 'ok') res(reponse.value);else rej(reponse.value);
      });
    } else rej('socket not connected');
  });
};

var createRoom = function createRoom(socket, profil) {
  return new Promise(function (res, rej) {
    if (socket && socket.connected && socket.id) socket.emit('createRoom', socket.id, profil, function (reponse) {
      if (reponse && reponse.type === 'ok') res(reponse.value);else rej(reponse.value);
    });else rej('socket not connected');
  });
};

var joinRoom = function joinRoom(socket, profil, idRoom) {
  return new Promise(function (res, rej) {
    if (socket && socket.connected && socket.id) socket.emit('joinRoom', socket.id, profil, idRoom, function (reponse) {
      if (reponse && reponse.type === 'ok') res(reponse.value);else rej(reponse.value);
    });else rej('socket not connected');
  });
};

var askToStartGame = function askToStartGame(socket, idRoom) {
  return new Promise(function (res, rej) {
    if (socket && socket.connected && socket.id) socket.emit('askToStartGame', socket.id, idRoom, res);else rej('socket not connected');
  });
};

var leaveRoom = function leaveRoom(socket, idRoom) {
  return new Promise(function (res, rej) {
    if (socket && socket.connected && socket.id) socket.emit('leaveRoom', socket.id, idRoom, res);else rej('socket not connected');
  });
};

var askToEndGame = function askToEndGame(socket, idRoom) {
  return new Promise(function (res, rej) {
    if (socket && socket.connected && socket.id) socket.emit('askToEndGame', socket.id, idRoom, res);else rej('socket not connected');
  });
};

var readyToStart = function readyToStart(socket, idRoom) {
  return new Promise(function (res, rej) {
    if (socket && socket.connected && socket.id) socket.emit('readyToStart', socket.id, idRoom, res);else rej('socket not connected');
  });
};

var askEverybodyToCalmDown = function askEverybodyToCalmDown(socket, idRoom) {
  return new Promise(function (res, rej) {
    if (socket && socket.connected && socket.id) socket.emit('askEverybodyToCalmDown', socket.id, idRoom, res);else rej('socket not connected');
  });
};

exports.default = { move: move, getRoomInfo: getRoomInfo, createRoom: createRoom, joinRoom: joinRoom, askToEndGame: askToEndGame, askToStartGame: askToStartGame, leaveRoom: leaveRoom, readyToStart: readyToStart, askEverybodyToCalmDown: askEverybodyToCalmDown };