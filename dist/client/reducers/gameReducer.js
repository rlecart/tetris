'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialGameState = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _gameAction = require('../actions/gameAction.js');

var _defaultGame = require('../ressources/defaultGame.js');

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
      return initialGameState;
    case _gameAction.ADD_WINNER:
      nextState = _extends({}, state, {
        winner: _extends({}, action.value)
      });
      return nextState;
    default:
      return state;
  }
};

exports.initialGameState = initialGameState;
exports.default = gameReducer;