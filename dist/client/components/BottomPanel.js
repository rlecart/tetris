"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BottomPanel = function BottomPanel(_ref) {
  var children = _ref.children,
      id = _ref.id;
  return _react2.default.createElement(
    "div",
    { className: "bottomPanel", id: id },
    children
  );
};

exports.default = BottomPanel;