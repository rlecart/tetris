'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cloneDeep = require('lodash/cloneDeep.js');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _defaultGame = require('../../client/ressources/defaultGame.js');

var _defaultGame2 = _interopRequireDefault(_defaultGame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game(shapes, shapesId) {
    _classCallCheck(this, Game);

    this._lines = (0, _cloneDeep2.default)(_defaultGame2.default.lines);
    this._spec = (0, _cloneDeep2.default)(_defaultGame2.default.lines);
    this._tetri = (0, _cloneDeep2.default)(_defaultGame2.default.tetri);
    this._tetri.id = shapesId[0];
    this._tetri.nextId = shapesId[1];
    this._tetri.actualShape = shapes[0];
    this._tetri.nextShape = shapes[1];
    this._tetri.x = Math.trunc(this._lines[0].length / 2 - this._tetri.actualShape[0].length / 2);
    this._tetri.y = -1;
    this._placed = (0, _cloneDeep2.default)(_defaultGame2.default.placed);
    this._isWaiting = false;
  }

  _createClass(Game, [{
    key: 'formatIt',
    value: function formatIt() {
      var ret = {};

      ret.lines = this.getLines();
      ret.tetri = this.getTetri();
      ret.placed = this.getPlaced();
      return ret;
    }
  }, {
    key: 'isWaiting',
    value: function isWaiting() {
      return this._isWaiting;
    }
  }, {
    key: 'getTetri',
    value: function getTetri() {
      return this._tetri;
    }
  }, {
    key: 'getLines',
    value: function getLines(i, j) {
      if (this._lines && i !== undefined) {
        if (this._lines[i] && j !== undefined) return this._lines[i][j];
        return this._lines[i];
      }
      return this._lines;
    }
  }, {
    key: 'getSpec',
    value: function getSpec() {
      return this._spec;
    }
  }, {
    key: 'getActualShape',
    value: function getActualShape(i, j) {
      if (this._tetri) {
        if (this._tetri.actualShape && i !== undefined) {
          if (this._tetri.actualShape[i] && j !== undefined) {
            return this._tetri.actualShape[i][j];
          }
          return this._tetri.actualShape[i];
        }
      }
      return this._tetri.actualShape;
    }
  }, {
    key: 'getPlaced',
    value: function getPlaced() {
      return this._placed;
    }
  }, {
    key: 'getId',
    value: function getId() {
      return this._tetri.id;
    }
  }, {
    key: 'getX',
    value: function getX() {
      return this._tetri.x;
    }
  }, {
    key: 'getY',
    value: function getY() {
      return this._tetri.y;
    }
  }, {
    key: 'setWaiting',
    value: function setWaiting(value) {
      this._isWaiting = value;
    }
  }, {
    key: 'setTetri',
    value: function setTetri(tetri) {
      this._tetri.id = tetri.id;
      this._tetri.actualShape = tetri.actualShape;
      this._tetri.nextId = tetri.nextId;
      this._tetri.nextShape = tetri.nextShape;
      this._tetri.rotation = tetri.rotation;
      this._tetri.x = tetri.x;
      this._tetri.y = tetri.y;
    }
  }, {
    key: 'setLines',
    value: function setLines(i, j, value) {
      if (this._lines && i !== undefined) {
        if (this._lines[i] && j !== undefined) {
          this._lines[i][j] = value;
        } else this._lines[i] = value;
      } else this._lines = value;
    }
  }, {
    key: 'addPlaced',
    value: function addPlaced(nb) {
      this._placed += nb;
    }
  }, {
    key: 'setActualShape',
    value: function setActualShape(value) {
      this._tetri.actualShape = value;
    }
  }, {
    key: 'setNextShape',
    value: function setNextShape(value) {
      this._tetri.nextShape = value;
    }
  }, {
    key: 'setId',
    value: function setId(value) {
      this._tetri.id = value;
    }
  }, {
    key: 'setNextId',
    value: function setNextId(value) {
      this._tetri.nextId = value;
    }
  }, {
    key: 'addX',
    value: function addX(value) {
      this._tetri.x += value;
    }
  }, {
    key: 'addY',
    value: function addY(value) {
      this._tetri.y += value;
    }
  }, {
    key: 'subX',
    value: function subX(value) {
      this._tetri.x -= value;
    }
  }, {
    key: 'subY',
    value: function subY(value) {
      this._tetri.y -= value;
    }
  }, {
    key: 'setX',
    value: function setX(value) {
      this._tetri.x = value;
    }
  }, {
    key: 'setY',
    value: function setY(value) {
      this._tetri.y = value;
    }
  }, {
    key: 'removeFilledLine',
    value: function removeFilledLine(i) {
      this._lines.splice(i, 1);
      this._lines.unshift(new Array(this._lines[0].length).fill(0));
    }
  }, {
    key: 'fillLine',
    value: function fillLine() {
      this._lines.push(new Array(this.getLines(0).length).fill(1));
      this._lines.shift();
      this.refreshSpec(this.getLines());
    }
  }, {
    key: 'refreshSpec',
    value: function refreshSpec(lines) {
      this._spec = (0, _cloneDeep2.default)(lines);
    }
  }]);

  return Game;
}();

exports.default = Game;
;