'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialGameState = exports.gameReducer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _gameAction = require('../actions/gameAction.js');

var _defaultGame = require('../../ressources/defaultGame.js');

var _defaultGame2 = _interopRequireDefault(_defaultGame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialGameState = _extends({}, _defaultGame2.default);

var gameReducer = function gameReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialGameState;
  var action = arguments[1];

  var nextState = void 0;

  switch (action.type) {
    case _gameAction.SYNC_GAME_DATA:
      nextState = _extends({}, state, action.value);
      return nextState;
    case _gameAction.DELETE_GAME_DATA:
      nextState = _extends({}, initialGameState);
      return nextState;
    case _gameAction.ADD_WINNER:
      nextState = _extends({}, state, {
        winner: _extends({}, action.value)
      });
      return nextState;
    case _gameAction.UPDATE_ACID_MODE:
      var newDisplayLines = state.lines;

      // for (let line in newDisplayLines)
      //   for (let char in newDisplayLines[line])
      newDisplayLines.forEach(function (line) {
        return line.forEach(function (char) {
          char = (char + 1) % 9;
        });
      });
      // newDisplayLines[line][char] = (newDisplayLines[line][char] + 1) % 9;
      nextState = _extends({}, state, {
        lines: newDisplayLines
      });
      return nextState;
    case _gameAction.ACID_MODE:
      var nextIsInAcid = state.isInAcid;
      var nextAcidInterval = state.acidInterval;

      if (!state.isInAcid) {
        nextIsInAcid = true;
        nextAcidInterval = action.value;
      } else {
        clearInterval(action.value);
        clearInterval(state.acidInterval);
        nextIsInAcid = false;
        nextAcidInterval = undefined;
      }
      nextState = _extends({}, state, {
        isInAcid: nextIsInAcid,
        acidInterval: nextAcidInterval
      });
      return nextState;
    case _gameAction.STOP_ACID_MODE:
      clearInterval(state.acidInterval);
      nextIsInAcid = false;
      nextAcidInterval = undefined;
      nextState = _extends({}, state, {
        isInAcid: nextIsInAcid,
        acidInterval: nextAcidInterval
      });
      return nextState;
    default:
      return state;
  }
};

exports.gameReducer = gameReducer;
exports.initialGameState = initialGameState;
exports.default = gameReducer;