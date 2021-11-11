'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _defaultRules = require('../../client/ressources/defaultRules.js');

var _defaultRules2 = _interopRequireDefault(_defaultRules);

var _Player = require('./Player.js');

var _Player2 = _interopRequireDefault(_Player);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _refresh = require('../refresh.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Room = function () {
  function Room() {
    _classCallCheck(this, Room);

    this._url = '';
    this._inGame = false;
    this._nbPlayer = 0;
    this._listPlayers = {};
    this._rules = _lodash2.default.cloneDeep(_defaultRules2.default);
    this._isOut = {};

    this._interval = undefined;
    this._shapes = [];
    this._shapesId = [];

    this._readyToStart = {};

    this._sioList = {};
    this._owner = undefined;
    this._arrivalOrder = [];
    this._pending = true;
  }

  _createClass(Room, [{
    key: 'getSio',
    value: function getSio(id) {
      if (id !== undefined) return this._sioList[id];
      return this._sioList;
    }
  }, {
    key: 'getUrl',
    value: function getUrl() {
      return this._url;
    }
  }, {
    key: 'getListPlayers',
    value: function getListPlayers(player) {
      if (player !== undefined) return this._listPlayers[player];
      return this._listPlayers;
    }
  }, {
    key: 'getNbPlayer',
    value: function getNbPlayer() {
      return this._nbPlayer;
    }
  }, {
    key: 'getShapes',
    value: function getShapes(i) {
      if (i !== undefined) return this._shapes[i];
      return this._shapes;
    }
  }, {
    key: 'getShapesId',
    value: function getShapesId(i) {
      if (i !== undefined) return this._shapesId[i];
      return this._shapesId;
    }
  }, {
    key: 'getReadyToStart',
    value: function getReadyToStart() {
      return this._readyToStart;
    }
  }, {
    key: 'getRules',
    value: function getRules() {
      return this._rules;
    }
  }, {
    key: 'getInterval',
    value: function getInterval() {
      return this._interval;
    }
  }, {
    key: 'getOwner',
    value: function getOwner() {
      return this._owner;
    }
  }, {
    key: 'getArrivalOrder',
    value: function getArrivalOrder() {
      return this._arrivalOrder;
    }
  }, {
    key: 'getRoomInfo',
    value: function getRoomInfo() {
      var roomInfo = {};

      roomInfo.url = this._url;
      roomInfo.inGame = this._inGame;
      roomInfo.nbPlayer = this._nbPlayer;
      roomInfo.rules = this._rules;
      roomInfo.listPlayers = this._listPlayers;
      roomInfo.owner = this._owner;
      return roomInfo;
    }
  }, {
    key: 'getAllGames',
    value: function getAllGames(only, exception) {
      var ret = {};
      var playersList = {};

      if (only !== undefined) return this.getListPlayers(only).getGame();else playersList = this.getListPlayers();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.entries(playersList)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              value = _step$value[1];

          if (key !== exception && key !== undefined) ret = _extends({}, ret, _defineProperty({}, key, value.getGame()));
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
    }
  }, {
    key: 'isOut',
    value: function isOut(id) {
      if (this._isOut !== undefined) return this._isOut[id];
    }
  }, {
    key: 'isInGame',
    value: function isInGame() {
      return this._inGame;
    }
  }, {
    key: 'isPending',
    value: function isPending() {
      return this._pending;
    }
  }, {
    key: 'isOwner',
    value: function isOwner(id) {
      if (this._owner === id) return true;
      return false;
    }
  }, {
    key: 'addSio',
    value: function addSio(sio) {
      if (sio && sio.id) this._sioList = _extends({}, this._sioList, _defineProperty({}, sio.id, sio));
    }
  }, {
    key: 'removeSio',
    value: function removeSio(id) {
      this._sioList = _extends({}, this._sioList, _defineProperty({}, id, undefined));
      delete this._sioList[id];
    }
  }, {
    key: 'setUrl',
    value: function setUrl(url) {
      this._url = url;
    }
  }, {
    key: 'addOut',
    value: function addOut(id) {
      this._isOut = _extends({}, this._isOut, _defineProperty({}, id, id));

      if (Object.keys(this._isOut).length >= this._nbPlayer - 1) {
        var winnerInfo = {};
        var winnerId = void 0;

        if (this.getNbPlayer() > 1) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Object.keys(this.getListPlayers())[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var key = _step2.value;

              if (this._isOut[key] === undefined) winnerId = key;
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

          winnerInfo = {
            name: String(this.getListPlayers(winnerId).getName()),
            id: winnerId
          };
        }
        this._isOut = undefined;
        this.endGame();
        this.emitAll('theEnd', undefined, { winnerInfo: winnerInfo });
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = Object.values(this.getListPlayers())[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var player = _step3.value;

            player.setGame(undefined);
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
    }
  }, {
    key: 'setInGame',
    value: function setInGame(value) {
      this._inGame = value;
    }
  }, {
    key: 'endGame',
    value: function endGame(res) {
      var _this = this;

      clearInterval(this._interval);
      this.setPending(true);
      this._interval = undefined;
      this.setInGame(undefined);
      setTimeout(function () {
        _this._shapes = [];
        _this._shapesId = [];
        _this.setInGame(false);
        if (res !== undefined) res();
      }, 1500);
    }
  }, {
    key: 'resetUrl',
    value: function resetUrl() {
      this._url = undefined;
    }
  }, {
    key: 'addNewPlayer',
    value: function addNewPlayer(clientId, profil) {
      var owner = false;

      if (this._nbPlayer === 0) {
        this._owner = clientId;
        owner = true;
      }
      profil = _extends({}, profil, { owner: owner });
      this._arrivalOrder.push(clientId);
      this._listPlayers = _extends({}, this._listPlayers, _defineProperty({}, clientId, new _Player2.default(profil, clientId, this)));
      this._nbPlayer++;
    }
  }, {
    key: 'setPending',
    value: function setPending(value) {
      this._pending = value;
    }
  }, {
    key: 'addReadyToStart',
    value: function addReadyToStart(clientId) {
      this._readyToStart = _extends({}, this._readyToStart, _defineProperty({}, clientId, true));
    }
  }, {
    key: 'addNewShape',
    value: function addNewShape(shape) {
      this._shapes.push(shape);
    }
  }, {
    key: 'addShapesId',
    value: function addShapesId(id) {
      this._shapesId.push(id);
    }
  }, {
    key: 'setAllGames',
    value: function setAllGames(games) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = Object.entries(this.getListPlayers())[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _step4$value = _slicedToArray(_step4.value, 2),
              id = _step4$value[0],
              client = _step4$value[1];

          client.setGame(games[id]);
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
    }
  }, {
    key: 'resetReadyToStart',
    value: function resetReadyToStart() {
      this._readyToStart = undefined;
    }
  }, {
    key: 'removePlayer',
    value: function removePlayer(clientId) {
      this._nbPlayer--;
      if (this._owner === clientId) {
        if (this._nbPlayer > 0) {
          this._owner = this._arrivalOrder[1];
          this._listPlayers[this._owner]._profil.owner = true;
        }
      }
      this._arrivalOrder.splice(this._arrivalOrder.indexOf(clientId), 1);
      if (this.isOut(clientId) !== undefined) delete this._isOut[clientId];
      delete this._listPlayers[clientId];
      delete this._sioList[clientId];
      this.emitAll('refreshRoomInfo', clientId, this.getRoomInfo());
    }
  }, {
    key: 'launchGame',
    value: function launchGame(sio) {
      (0, _refresh.initShapes)(this);
      this.initGames();
      this.setInGame(true);
      this.setPending(false);
      this._interval = setInterval(this.gameLoop.bind(this), 1000, this.getSio(), this.getUrl());
      this._readyToStart = undefined;
    }
  }, {
    key: 'hiddenSpec',
    value: function hiddenSpec(ret) {
      var hiddenCols = new Array(ret.length);

      for (var player in ret) {
        hiddenCols[player] = new Array(ret[player].lines[0].length).fill(false);
        for (var line in ret[player].lines) {
          for (var i in ret[player].lines[line]) {
            if (hiddenCols[player][i] === false && ret[player].lines[line][i] !== 0 && ret[player].lines[line][i] !== 1) hiddenCols[player][i] = true;else if (hiddenCols[player][i] === true) ret[player].lines[line][i] = 1;
          }
        }
      }
      hiddenCols = null;
      return ret;
    }
  }, {
    key: 'createSpecList',
    value: function createSpecList(exception) {
      var hidden = true;
      var retHidden = [];
      var ret = [];

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = Object.entries(this.getListPlayers())[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _step5$value = _slicedToArray(_step5.value, 2),
              id = _step5$value[0],
              player = _step5$value[1];

          if (id !== exception && player && player.getGame() && player.getGame().getSpec()) {
            ret.push({
              lines: _lodash2.default.cloneDeep(player.getGame().getSpec()),
              name: player.getName()
            });
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      if (this.getNbPlayer() > 1 && ret) {
        if (hidden) retHidden = this.hiddenSpec(ret);
        return retHidden;
      }
      return ret;
    }
  }, {
    key: 'initGames',
    value: function initGames() {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = Object.values(this.getListPlayers())[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var player = _step6.value;

          player.setNewGame(this.getShapes(), this.getShapesId());
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    }
  }, {
    key: 'flatGames',
    value: function flatGames(only) {
      var ret = void 0;

      if (only !== undefined && !this.isOut(only)) {
        ret = _lodash2.default.cloneDeep(this.getAllGames(only));
        (0, _refresh.addTetri)(ret);
        return ret.formatIt();
      }
    }
  }, {
    key: 'refreshAllVues',
    value: function refreshAllVues(socketClients, url, exception) {
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = Object.entries(socketClients)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _step7$value = _slicedToArray(_step7.value, 2),
              id = _step7$value[0],
              client = _step7$value[1];

          if (this.isInGame() === true && id !== exception) {
            var flatGame = this.flatGames(id);
            client.emit('refreshVue', flatGame, this.createSpecList(id));
          }
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    }
  }, {
    key: 'gameLoop',
    value: function gameLoop(socketClients, url) {
      // let gamesTmp = _.cloneDeep(this.getAllGames());
      var gamesTmp = this.getAllGames();

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = Object.keys(socketClients)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var id = _step8.value;

          if (this.isInGame() === true && !this.isOut(id)) gamesTmp[id] = (0, _refresh.refresh)(gamesTmp[id], this, id);
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      if (this.isInGame() === true) {
        this.setAllGames(gamesTmp);
        this.refreshAllVues(socketClients, url);
      }
    }
  }, {
    key: 'emitAll',
    value: function emitAll(message, except, obj, spec) {
      var clientList = this.getSio();

      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = Object.entries(clientList)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var _step9$value = _slicedToArray(_step9.value, 2),
              id = _step9$value[0],
              client = _step9$value[1];

          if (id !== except) {
            client.emit(message, obj, spec);
          }
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }
    }
  }, {
    key: 'emitOnly',
    value: function emitOnly(message, only, obj, spec) {
      var clientList = this.getSio();

      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = Object.entries(clientList)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          var _step10$value = _slicedToArray(_step10.value, 2),
              id = _step10$value[0],
              client = _step10$value[1];

          if (id === only) client.emit(message, obj, spec);
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10.return) {
            _iterator10.return();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }
    }
  }]);

  return Room;
}();

exports.default = Room;
;