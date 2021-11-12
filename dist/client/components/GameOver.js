"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GameOver = function GameOver(_ref) {
  var finalText = _ref.finalText,
      returnToRoomButton = _ref.returnToRoomButton,
      goBack = _ref.goBack;
  return _react2.default.createElement(
    "div",
    { className: "gameOverDisplay" },
    _react2.default.createElement(
      "div",
      { className: "gameOverLayout" },
      _react2.default.createElement(
        "div",
        { className: "gameOverTitle" },
        _react2.default.createElement(
          "span",
          { className: "textButton", id: "gameOverText" },
          "OMG GG WP DUUUDE"
        ),
        finalText
      ),
      _react2.default.createElement(
        "div",
        { className: "bottomButtons" },
        returnToRoomButton,
        goBack
      )
    )
  );
};

exports.default = GameOver;