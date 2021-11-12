'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Room = require('./Room.js');

var _Room2 = _interopRequireDefault(_Room);

var _Servers = require('./Servers.js');

var _Servers2 = _interopRequireDefault(_Servers);

var _utils = require('../../misc/utils.js');

var _refresh = require('../refresh.js');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Master = function () {
  function Master() {
    _classCallCheck(this, Master);

    this._roomsList = {};
    this._sioClientList = {};
    this._server = {};
  }

  _createClass(Master, [{
    key: 'startServer',
    value: function startServer() {
      var _this = this;

      return new Promise(function (res) {
        _this._server = new _Servers2.default(_this);
        _this._server.startServer(function () {
          _this._server.listenSio(_this);
          // console.log('c bien res');
          res();
        });
      });
      // console.log('[Server completely started]')
    }
  }, {
    key: 'stopServer',
    value: function stopServer() {
      var _this2 = this;

      return new Promise(function (res) {
        _this2._server.stopListenSio(_this2._sioClientList);
        _this2._server.stopServer();
        _this2._server = undefined;
        res();
        // console.log('[Server completely stopped]')
      });
    }
  }, {
    key: 'getServer',
    value: function getServer() {
      return this._server;
    }
  }, {
    key: 'getRoomsList',
    value: function getRoomsList() {
      return this._roomsList;
    }
  }, {
    key: 'getRoom',
    value: function getRoom(url) {
      if (url !== undefined && this._roomsList !== undefined && this._roomsList[url] !== undefined) return this._roomsList[url];
    }
  }, {
    key: 'getSioList',
    value: function getSioList(only) {
      if (only !== undefined) return this._sioClientList[only];
      return this._sioClientList;
    }
  }, {
    key: 'getSioHbeat',
    value: function getSioHbeat(id) {
      return this._sioClientList[id].hbeat;
    }
  }, {
    key: 'getRoomFromPlayerId',
    value: function getRoomFromPlayerId(id) {
      var room = void 0;

      if (id !== undefined) {
        for (var url in this.getRoomsList()) {
          room = this.getRoom(url);
          if (room.getListPlayers(id) !== undefined) return room;
        }
      }
      return undefined;
    }
  }, {
    key: 'getSioListFromRoom',
    value: function getSioListFromRoom(url) {
      var ret = void 0;
      var room = void 0;

      if ((room = this.getRoom(url)) && room.getListPlayers()) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(room.getListPlayers())[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var id = _step.value;

            ret = _extends({}, ret, _defineProperty({}, id, this.getSioList(id)));
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
      }
      return ret;
    }
  }, {
    key: 'isInRoom',
    value: function isInRoom(clientId) {
      if (Object.keys(this.getRoomsList()).length > 0) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Object.values(this.getRoomsList())[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var room = _step2.value;

            if (room.getListPlayers(clientId) !== undefined) return true;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
      return false;
    }
  }, {
    key: 'addNewRoom',
    value: function addNewRoom(room) {
      this._roomsList = _extends({}, this._roomsList, _defineProperty({}, room.getUrl(), room));
    }
  }, {
    key: 'setSioHbeat',
    value: function setSioHbeat(id, value) {
      this._sioClientList[id].hbeat = value;
    }
  }, {
    key: 'addNewSio',
    value: function addNewSio(client) {
      this._sioClientList = _extends({}, this._sioClientList, _defineProperty({}, client.id, client));
    }
  }, {
    key: 'removeSio',
    value: function removeSio(client) {
      if (this._sioClientList[client] !== undefined) {
        this._sioClientList[client].disconnect();
        delete this._sioClientList[client];
      }
    }
  }, {
    key: 'createRoom',
    value: function createRoom(clientId, profil, cb) {
      var room = void 0;

      if (profil && profil !== undefined && profil.name && profil.name !== undefined && profil.name.length > 0 && clientId !== undefined && clientId !== null) {
        if (this.isInRoom(clientId) && (room = this.getRoomFromPlayerId(clientId))) this.leaveRoom(clientId, room.getUrl());
        room = new _Room2.default(this);
        room.setUrl((0, _utils.createNewUrl)(this.getRoomsList()));
        this.addNewRoom(room);
        this.joinRoom(clientId, profil, room.getUrl(), cb);
      } else cb({ type: 'err', value: 'bad profil or clienId' });
    }
  }, {
    key: 'joinRoom',
    value: function joinRoom(clientId, profil, url, cb) {
      var room = void 0;

      if (profil && profil !== undefined && profil.name && profil.name !== undefined && profil.name.length > 0 && clientId !== undefined && clientId !== null) {
        if (this.isInRoom(clientId) && (room = this.getRoomFromPlayerId(clientId))) this.leaveRoom(clientId, room.getUrl());
        if ((room = this.getRoom(url)) && room.isInGame() !== true && room.getNbPlayer() < 8) {
          profil = _extends({}, profil, { url: url });
          room.addNewPlayer(clientId, profil);
          room.addSio(this.getSioList(clientId));
          room.emitAll('refreshRoomInfo', clientId, room.getRoomInfo());
          cb({ type: 'ok', value: url });
        } else {
          cb({ type: 'err', value: 'room full or closed' });
        }
      } else cb({ type: 'err', value: 'bad profil or clienId' });
    }
  }, {
    key: 'leaveRoom',
    value: function leaveRoom(clientId, url, res) {
      var room = void 0;

      if ((room = this.getRoom(url)) && room.getListPlayers(clientId)) {
        room.removePlayer(clientId);
        if (room.getNbPlayer() <= 0) {
          this.closeRoom(room);
        }
        if (res !== undefined) res();
      }
    }
  }, {
    key: 'closeRoom',
    value: function closeRoom(room) {
      var url = room.getUrl();
      var clientsRoom = void 0;

      if ((clientsRoom = this.getSioListFromRoom(url)) !== undefined) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = Object.keys(clientsRoom)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var id = _step3.value;

            room.removePlayer(id);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
      room.resetUrl();
      this._roomsList[url] = undefined;
      delete this._roomsList[url];
    }
  }, {
    key: 'askToStartGame',
    value: function askToStartGame(clientId, url, res) {
      var room = {};

      if ((room = this.getRoom(url)) && room.isOwner(clientId) && room.isInGame() === false) room.emitAll('goToGame');
      if (res !== undefined) res();
    }
  }, {
    key: 'askToEndGame',
    value: function askToEndGame(clientId, url, res) {
      var room = {};

      if (room = this.getRoom(url)) (0, _refresh.endGame)(room, clientId, res);
      if (res !== undefined) res();
    }
  }, {
    key: 'tryToStart',
    value: function tryToStart(clientsRTS, nbPlayers) {
      var i = 0;

      for (var client in clientsRTS) {
        i++;
      }if (i === nbPlayers) return true;
      return false;
    }
  }, {
    key: 'readyToStart',
    value: function readyToStart(clientId, url, res) {
      var room = void 0;

      if (url && clientId && (room = this.getRoom(url)) && room.getListPlayers(clientId) && room.isInGame() === false && room.isPending()) {
        room.addReadyToStart(clientId);
        if (this.tryToStart(room.getReadyToStart(), room.getNbPlayer())) {
          room.launchGame(this.getSioListFromRoom(url));
        }
        if (res !== undefined) res();
      } else if (room !== undefined && room.getListPlayers(clientId) && !room.isPending()) room.emitOnly('nowChillOutDude', clientId, '/' + url + '[' + String(room.getListPlayers(clientId).getName()) + ']');
    }
  }, {
    key: 'askToMove',
    value: function askToMove(clientId, url, dir, res) {
      var room = {};
      var player = {};
      var game = {};

      if ((room = this.getRoom(url)) && (player = room.getListPlayers(clientId))) {
        if ((game = player.getGame()) && game.getY() !== -1) player.move(dir, room);
        if (res !== undefined) res();
      }
    }
  }, {
    key: 'askEverybodyToCalmDown',
    value: function askEverybodyToCalmDown(clientId, url, res) {
      var room = {};
      var sioList = {};

      if ((room = this.getRoom(url)) && room.getOwner() === clientId && (sioList = room.getSio())) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = Object.entries(sioList)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _step4$value = _slicedToArray(_step4.value, 2),
                id = _step4$value[0],
                client = _step4$value[1];

            client.emit('nowChillOutDude', '/' + url + '[' + String(room.getListPlayers(id).getName()) + ']');
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        room.setPending(true);
        if (res !== undefined) res();
      }
    }
  }]);

  return Master;
}();

exports.default = Master;
;