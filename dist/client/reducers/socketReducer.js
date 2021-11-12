"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialSocketState = exports.socketReducer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _socketAction = require("../actions/socketAction");

var initialSocketState = {
  socket: undefined
};

var socketReducer = function socketReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialSocketState;
  var action = arguments[1];

  var nextState = void 0;

  switch (action.type) {
    case _socketAction.CONNECT_SOCKET:
      nextState = _extends({}, state, {
        socket: action.value
      });
      return nextState;
    default:
      return state;
  }
};

exports.socketReducer = socketReducer;
exports.initialSocketState = initialSocketState;
exports.default = socketReducer;