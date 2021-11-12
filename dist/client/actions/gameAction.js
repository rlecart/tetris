'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SYNC_GAME_DATA = exports.SYNC_GAME_DATA = 'SYNC_GAME_DATA';
var DELETE_GAME_DATA = exports.DELETE_GAME_DATA = 'DELETE_GAME_DATA';
var ADD_WINNER = exports.ADD_WINNER = 'ADD_WINNER';
var ACID_MODE = exports.ACID_MODE = 'ACID_MODE';
var UPDATE_ACID_MODE = exports.UPDATE_ACID_MODE = 'UPDATE_ACID_MODE';
var STOP_ACID_MODE = exports.STOP_ACID_MODE = 'STOP_ACID_MODE';

var setNewGameInfo = function setNewGameInfo(dispatch, newGameInfo) {
  var action = {
    type: 'SYNC_GAME_DATA',
    value: {
      lines: newGameInfo.lines,
      tetri: newGameInfo.tetri,
      isWaiting: newGameInfo.isWaiting,
      placed: newGameInfo.placed,
      spec: newGameInfo.spec
    }
  };
  dispatch(action);
};

var deleteGameData = function deleteGameData(dispatch) {
  var action = { type: DELETE_GAME_DATA };
  dispatch(action);
};

var addWinner = function addWinner(dispatch, winnerInfo) {
  var action = {
    type: ADD_WINNER,
    value: winnerInfo
  };
  dispatch(action);
};

var acidMode = function acidMode(dispatch) {
  var action = {
    type: ACID_MODE,
    value: setInterval(function () {
      return dispatch({ type: UPDATE_ACID_MODE });
    }, 50)
  };
  dispatch(action);
};

var stopAcidMode = function stopAcidMode(dispatch) {
  var action = { type: STOP_ACID_MODE };
  dispatch(action);
};

exports.setNewGameInfo = setNewGameInfo;
exports.deleteGameData = deleteGameData;
exports.addWinner = addWinner;
exports.acidMode = acidMode;
exports.stopAcidMode = stopAcidMode;