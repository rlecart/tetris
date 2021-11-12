'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteRoomData = exports.setNewRoomInfo = exports.DELETE_ROOM_DATA = exports.SYNC_ROOM_DATA = undefined;

var _utils = require('../../misc/utils.js');

var SYNC_ROOM_DATA = exports.SYNC_ROOM_DATA = 'SYNC_ROOM_DATA';
var DELETE_ROOM_DATA = exports.DELETE_ROOM_DATA = 'DELETE_ROOM_DATA';

var setNewRoomInfo = function setNewRoomInfo(dispatch, newRoomInfo) {
  var action = {
    type: SYNC_ROOM_DATA,
    value: newRoomInfo
  };

  if (!newRoomInfo || (0, _utils.isEmpty)(newRoomInfo)) return -1;
  dispatch(action);
};

var deleteRoomData = function deleteRoomData(dispatch) {
  var action = { type: DELETE_ROOM_DATA };
  dispatch(action);
};

exports.setNewRoomInfo = setNewRoomInfo;
exports.deleteRoomData = deleteRoomData;