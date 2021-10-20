'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SYNC_GAME_DATA = exports.SYNC_GAME_DATA = 'SYNC_GAME_DATA';
var DELETE_GAME_DATA = exports.DELETE_GAME_DATA = 'DELETE_GAME_DATA';
var ADD_WINNER = exports.ADD_WINNER = 'ADD_WINNER';

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

exports.default = { setNewGameInfo: setNewGameInfo, deleteGameData: deleteGameData, addWinner: addWinner };