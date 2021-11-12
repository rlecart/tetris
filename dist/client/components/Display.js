"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Display = function Display(_ref) {
  var children = _ref.children;
  return _react2.default.createElement(
    "div",
    { className: "display" },
    children
  );
};

exports.default = Display;