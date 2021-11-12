"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextReveal = function TextReveal(_ref) {
  var text1 = _ref.text1,
      text2 = _ref.text2;
  return _react2.default.createElement(
    _react.Fragment,
    null,
    _react2.default.createElement(
      "span",
      { className: "textButton", id: "gameOverTextReveal" },
      text1
    ),
    _react2.default.createElement(
      "span",
      { className: "textButton", id: "gameOverTextReveal" },
      text2
    )
  );
};

exports.default = TextReveal;