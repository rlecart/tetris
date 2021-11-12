"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LeaveButton = function LeaveButton(_ref) {
  var toExecute = _ref.toExecute,
      text = _ref.text;
  return _react2.default.createElement(
    "button",
    { className: "roomButton", id: "leaveGame", onClick: toExecute },
    _react2.default.createElement(
      "span",
      { className: "textButton" },
      "" + text
    )
  );
};

exports.default = LeaveButton;