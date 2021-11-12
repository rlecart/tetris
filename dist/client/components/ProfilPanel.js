"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProfilPanel = function ProfilPanel(_ref) {
  var homeReducer = _ref.homeReducer,
      handleChange = _ref.handleChange;
  return _react2.default.createElement(
    "div",
    { className: "blocMenu", id: "home" },
    _react2.default.createElement(
      "div",
      { className: "avatarSelector" },
      _react2.default.createElement("div", { className: "avatarButton" }),
      _react2.default.createElement("div", { className: "avatar" }),
      _react2.default.createElement("div", { className: "avatarButton" })
    ),
    _react2.default.createElement("input", {
      className: "username",
      type: "text",
      name: "name",
      pattern: "[A-Za-z-]{1,}", required: true,
      placeholder: "username",
      value: homeReducer.profil.name,
      onChange: function onChange(event) {
        return handleChange(event);
      } })
  );
};

exports.default = ProfilPanel;