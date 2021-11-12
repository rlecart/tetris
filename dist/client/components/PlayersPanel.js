"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PlayersPanel = function PlayersPanel(_ref) {
  var players = _ref.players,
      startGameButton = _ref.startGameButton,
      leaveRoom = _ref.leaveRoom;
  return _react2.default.createElement(
    "div",
    { className: "blocMenu", id: "listPlayers" },
    _react2.default.createElement(
      "div",
      { className: "playerList" },
      players
    ),
    _react2.default.createElement(
      "div",
      { className: "bottomButtons" },
      _react2.default.createElement(
        "button",
        { className: "roomButton", id: "leave", onClick: leaveRoom },
        _react2.default.createElement(
          "span",
          { className: "textButton" },
          "Quitter"
        )
      ),
      startGameButton
    )
  );
};

exports.default = PlayersPanel;