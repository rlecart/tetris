'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defaultRules = require('./defaultRules.js');

var _defaultRules2 = _interopRequireDefault(_defaultRules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultRoom = {
  url: '',
  inGame: false,
  nbPlayer: 0,
  listPlayers: {},
  rules: _defaultRules2.default
};

exports.default = defaultRoom;