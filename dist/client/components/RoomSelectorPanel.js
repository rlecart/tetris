"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RoomSelectorPanel = function RoomSelectorPanel(_ref) {
  var homeReducer = _ref.homeReducer,
      whichButton = _ref.whichButton,
      setWhichButton = _ref.setWhichButton,
      handleChange = _ref.handleChange;
  return _react2.default.createElement(
    "div",
    { className: "blocMenu", id: "home" },
    _react2.default.createElement("input", { className: "roomUrl", type: "text", name: "roomUrl", required: whichButton === 'joinRoom', value: homeReducer.joinUrl,
      onChange: function onChange(event) {
        return handleChange(event);
      }, placeholder: "URL" }),
    _react2.default.createElement(
      "button",
      { type: "submit", className: "roomButton", id: "joinRoomButton", onClick: function onClick() {
          return setWhichButton('joinRoom');
        } },
      _react2.default.createElement(
        "span",
        { className: "textButton" },
        "Join room"
      )
    ),
    _react2.default.createElement(
      "button",
      { type: "submit", className: "roomButton", id: "createRoomButton", onClick: function onClick() {
          return setWhichButton('createRoom');
        } },
      _react2.default.createElement(
        "span",
        { className: "textButton" },
        "Create Room"
      )
    )
  );
};

exports.default = RoomSelectorPanel;