"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Spec = require("../components/Spec");

var _Spec2 = _interopRequireDefault(_Spec);

var _SpecList = require("../components/SpecList");

var _SpecList2 = _interopRequireDefault(_SpecList);

var _LinesContainer = require("./LinesContainer");

var _LinesContainer2 = _interopRequireDefault(_LinesContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createSpec = function createSpec(players) {
  var ret = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var player = _step.value;

      ret.push(_react2.default.createElement(_Spec2.default, {
        key: player.name,
        name: player.name,
        lines: _react2.default.createElement(_LinesContainer2.default, {
          key: player.name,
          lines: player.lines,
          lineClass: 'line',
          blocClass: 'lineBloc',
          id: 'spec'
        })
      }));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return ret;
};

var SpecListContainer = function SpecListContainer(_ref) {
  var specList = _ref.specList;

  var specs = specList ? createSpec(specList) : undefined;

  return _react2.default.createElement(
    _react.Fragment,
    null,
    specs ? _react2.default.createElement(_SpecList2.default, { specs: specs }) : undefined
  );
};

exports.default = SpecListContainer;