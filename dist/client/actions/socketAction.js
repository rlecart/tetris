'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CONNECT_SOCKET = exports.CONNECT_SOCKET = 'CONNECT_SOCKET';

var addSocket = function addSocket(dispatch, socket) {
  var action = {
    type: CONNECT_SOCKET,
    value: socket
  };

  if (socket) dispatch(action);
};

exports.default = addSocket;