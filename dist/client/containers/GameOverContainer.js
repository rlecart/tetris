"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _utils = require("../../misc/utils");

var _TextReveal = require("../components/TextReveal");

var _TextReveal2 = _interopRequireDefault(_TextReveal);

var _LeaveButton = require("../components/LeaveButton");

var _LeaveButton2 = _interopRequireDefault(_LeaveButton);

var _GameOver = require("../components/GameOver");

var _GameOver2 = _interopRequireDefault(_GameOver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GameOverContainer = function GameOverContainer(_ref) {
  var socketReducer = _ref.socketReducer,
      roomReducer = _ref.roomReducer,
      gameReducer = _ref.gameReducer,
      showGoBack = _ref.showGoBack,
      api = _ref.api,
      pleaseUnmountGame = _ref.pleaseUnmountGame,
      history = _ref.history;

  if (gameReducer && gameReducer.winner !== undefined) {
    var returnToRoomButton = undefined;
    var goBack = undefined;
    var finalText = undefined;
    var text1 = undefined;
    var text2 = undefined;

    if (roomReducer.owner === socketReducer.socket.id) returnToRoomButton = _react2.default.createElement(_LeaveButton2.default, {
      text: "Return to room",
      toExecute: function toExecute() {
        return api.askEverybodyToCalmDown(socketReducer.socket, roomReducer.url);
      }
    });
    if (showGoBack === true && !(roomReducer.owner === socketReducer.socket.id)) goBack = _react2.default.createElement(_LeaveButton2.default, {
      text: "Go back",
      toExecute: function toExecute() {
        var profil = roomReducer.listPlayers[socketReducer.socket.id]._profil;
        pleaseUnmountGame('completly');
        history.replace("/" + roomReducer.url + "[" + profil.name + "]");
      }
    });
    if (!(0, _utils.isEmpty)(gameReducer.winner)) {
      text1 = gameReducer.winner.id === socketReducer.socket.id ? 'what a pro you are, such a nice musculature!!! :Q' : 'but you lose, like the looser you are! :(((';
      text2 = gameReducer.winner.id === socketReducer.socket.id ? 'YOU are the real beaugosse!' : gameReducer.winner.name + " is the real beaugosse!";
      finalText = _react2.default.createElement(_TextReveal2.default, { text1: text1, text2: text2 });
    }

    return _react2.default.createElement(_GameOver2.default, {
      finalText: finalText,
      returnToRoomButton: returnToRoomButton,
      goBack: goBack
    });
  } else return null;
};

exports.default = GameOverContainer;