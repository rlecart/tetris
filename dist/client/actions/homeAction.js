'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SYNC_HOME_DATA = exports.SYNC_HOME_DATA = 'SYNC_HOME_DATA';

var setNewHomeInfo = function setNewHomeInfo(dispatch, newHomeInfo) {
  var action = {
    type: SYNC_HOME_DATA,
    value: {
      profil: newHomeInfo.newProfil,
      joinUrl: newHomeInfo.newJoinUrl,
      owner: newHomeInfo.newOwner
    }
  };
  dispatch(action);
};

exports.setNewHomeInfo = setNewHomeInfo;