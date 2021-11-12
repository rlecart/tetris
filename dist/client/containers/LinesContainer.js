"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _defaultColors = require("../../ressources/defaultColors.js");

var _defaultColors2 = _interopRequireDefault(_defaultColors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Bloc = function Bloc(_ref) {
  var bloc = _ref.bloc,
      blocClass = _ref.blocClass,
      id = _ref.id,
      idTetri = _ref.idTetri;

  var col = idTetri && bloc !== 0 ? idTetri : bloc;

  return _react2.default.createElement("div", { className: blocClass, id: id, style: { backgroundColor: _defaultColors2.default[col] } });
};

var Line = function Line(_ref2) {
  var line = _ref2.line,
      blocClass = _ref2.blocClass,
      id = _ref2.id,
      idTetri = _ref2.idTetri;

  var ret = [];

  for (var i in line) {
    ret.push(_react2.default.createElement(Bloc, { key: i, bloc: line[i], blocClass: blocClass, id: id, idTetri: idTetri }));
  }return ret;
};

var LinesContainer = function LinesContainer(_ref3) {
  var lines = _ref3.lines,
      lineClass = _ref3.lineClass,
      blocClass = _ref3.blocClass,
      id = _ref3.id,
      idTetri = _ref3.idTetri;

  var ret = [];

  if (idTetri === 5 && lines.length < 3) lines.unshift(new Array(lines[0].length).fill(0));
  for (var i in lines) {
    ret.push(_react2.default.createElement(
      "div",
      { key: i, className: lineClass },
      _react2.default.createElement(Line, { line: lines[i], blocClass: blocClass, id: id, idTetri: idTetri })
    ));
  }
  return ret;
};

exports.default = LinesContainer;