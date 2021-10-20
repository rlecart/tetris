'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Master = require('./classes/Master.js');

var _Master2 = _interopRequireDefault(_Master);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var master = new _Master2.default();

master.startServer().then(function () {
  return console.log('aye suis ready');
}).catch(function () {
  return console.log('qqqqq');
});

exports.default = master;