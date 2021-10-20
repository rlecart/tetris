'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var canIStayHere = function canIStayHere(where, props) {
  return new Promise(function (res, rej) {
    if (where === 'game') {
      if (isEmpty(props.roomReducer) || isEmpty(props.socketReducer.socket)) rej();else res();
    } else if (where === 'room') {
      if (isEmpty(props.roomReducer) && isEmpty(props.homeReducer.home) || isEmpty(props.socketReducer.socket)) rej();else res();
    }
  });
};

var isEmpty = function isEmpty(obj) {
  if (!obj || Object.keys(obj).length === 0) return true;else return false;
};

var generateUrl = function generateUrl() {
  return Math.random().toString(36).substring(2);
};

var createNewUrl = function createNewUrl(roomsList) {
  var url = generateUrl();
  while (roomsList[url]) {
    url = generateUrl();
  }return url;
};

exports.canIStayHere = canIStayHere;
exports.isEmpty = isEmpty;
exports.generateUrl = generateUrl;
exports.createNewUrl = createNewUrl;