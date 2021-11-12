"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SpecList = function SpecList(_ref) {
  var specs = _ref.specs;
  return _react2.default.createElement(
    "div",
    { className: "game", id: "spec" },
    _react2.default.createElement(
      "div",
      { className: "spec" },
      specs
    )
  );
};

exports.default = SpecList;