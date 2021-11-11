"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialRoomState = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _defaultRoom = require("../ressources/defaultRoom.js");

var _defaultRoom2 = _interopRequireDefault(_defaultRoom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialRoomState = _extends({}, _defaultRoom2.default);

var roomReducer = function roomReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialRoomState;
  var action = arguments[1];

  var nextState = void 0;

  switch (action.type) {
    case SYNC_ROOM_DATA:
      nextState = _extends({}, state, action.value);
      return nextState;
    case DELETE_ROOM_DATA:
      return initialRoomState;
    default:
      return state;
  }
};

exports.initialRoomState = initialRoomState;
exports.default = roomReducer;