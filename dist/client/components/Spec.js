"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Spec = function Spec(_ref) {
  var name = _ref.name,
      lines = _ref.lines;
  return _react2.default.createElement(
    _react.Fragment,
    null,
    _react2.default.createElement(
      "div",
      { className: "blocSpec" },
      _react2.default.createElement(
        "div",
        { className: "board", id: "spec" },
        lines
      ),
      _react2.default.createElement(
        "div",
        { className: "nicknameSpec" },
        name
      )
    )
  );
};

exports.default = Spec;