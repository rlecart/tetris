"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Board = require("./Board");

var _Board2 = _interopRequireDefault(_Board);

var _RightPanel = require("./RightPanel");

var _RightPanel2 = _interopRequireDefault(_RightPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GamePanel = function GamePanel(_ref) {
  var displayLines = _ref.displayLines,
      nextTetri = _ref.nextTetri,
      gameReducer = _ref.gameReducer;
  return _react2.default.createElement(
    "div",
    { className: "game" },
    _react2.default.createElement(_Board2.default, { displayLines: displayLines }),
    _react2.default.createElement(_RightPanel2.default, { nextTetri: nextTetri })
  );
};

exports.default = GamePanel;