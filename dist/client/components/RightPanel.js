"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RightPanel = function RightPanel(_ref) {
  var nextTetri = _ref.nextTetri;
  return _react2.default.createElement(
    "div",
    { className: "rightPanel" },
    _react2.default.createElement(
      "div",
      { className: "nextText" },
      "NEXT :"
    ),
    _react2.default.createElement(
      "div",
      { className: "nextPiece" },
      nextTetri
    ),
    _react2.default.createElement(
      "div",
      { className: "score" },
      "Score :",
      _react2.default.createElement("br", null),
      "00"
    )
  );
};

exports.default = RightPanel;