"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TopPanel = function TopPanel() {
  return _react2.default.createElement(
    "div",
    { className: "topPanel" },
    _react2.default.createElement(
      "span",
      { className: "title" },
      "Super Tetris 3000"
    )
  );
};

exports.default = TopPanel;