'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialHomeState = exports.homeReducer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _homeAction = require('../actions/homeAction.js');

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
    case _homeAction.SYNC_HOME_DATA:
      nextState = _extends({}, state, action.value);
      return nextState;
    default:
      return state;
  }
};

exports.homeReducer = homeReducer;
exports.initialHomeState = initialHomeState;
exports.default = homeReducer;