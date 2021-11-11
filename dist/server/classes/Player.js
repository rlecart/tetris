'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _refresh = require('../refresh.js');

var _Game = require('./Game.js');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
  function Player(profil, clientId) {
    _classCallCheck(this, Player);

    this._clientId = clientId;
    this._profil = profil;
    this._game = undefined;
  }

  _createClass(Player, [{
    key: 'getId',
    value: function getId() {
      return this._clientId;
    }
  }, {
    key: 'getProfil',
    value: function getProfil() {
      return this._profil;
    }
  }, {
    key: 'getRoomUrl',
    value: function getRoomUrl() {
      return this._profil.url;
    }
  }, {
    key: 'getName',
    value: function getName() {
      return this._profil.name;
    }
  }, {
    key: 'getGame',
    value: function getGame() {
      return this._game;
    }
  }, {
    key: 'deleteGame',
    value: function deleteGame() {
      this._game = undefined;
    }
  }, {
    key: 'setNewGame',
    value: function setNewGame(shapes, shapesId) {
      this._game = new _Game2.default(shapes, shapesId);
    }
  }, {
    key: 'setGame',
    value: function setGame(newGame) {
      this._game = newGame;
    }
  }, {
    key: 'move',
    value: function move(dir, room) {
      var reponse = -2;

      if (dir === 'right') reponse = (0, _refresh.moveTetri)(this.getGame(), 1, 0);else if (dir === 'left') reponse = (0, _refresh.moveTetri)(this.getGame(), -1, 0);else if (dir === 'down') reponse = (0, _refresh.moveTetri)(this.getGame(), 0, 1);else if (dir === 'turn') reponse = (0, _refresh.moveTetri)(this.getGame(), 0, 0);else if (dir === 'stash') {
        while (reponse !== 1 && reponse !== 0) {
          reponse = (0, _refresh.moveTetri)(this.getGame(), 0, 1);
        }
      }
      if (reponse !== 0) room.emitOnly('refreshVue', this.getId(), room.flatGames(this.getId()), room.createSpecList(this.getId()));
    }
  }]);

  return Player;
}();

exports.default = Player;
;