"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Board = function Board(_ref) {
  var displayLines = _ref.displayLines;
  return _react2.default.createElement(
    "div",
    { className: "board" },
    displayLines
  );
};

exports.default = Board;