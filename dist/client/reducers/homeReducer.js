'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialHomeState = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _homeAction = require('../actions/homeAction.js');

var _homeAction2 = _interopRequireDefault(_homeAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialHomeState = {
  owner: undefined,
  profil: {
    name: ''
  },
  joinUrl: ''
};

var homeReducer = function homeReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialHomeState;
  var action = arguments[1];

  var nextState = void 0;

  switch (action.type) {
    case _homeAction2.default:
      nextState = _extends({}, state, action.value);
      return nextState;
    default:
      return state;
  }
};

exports.initialHomeState = initialHomeState;
exports.default = homeReducer;