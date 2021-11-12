'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTetri = exports.endGame = exports.initShapes = exports.moveTetri = exports.refresh = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _defaultTetriminos = require('../ressources/defaultTetriminos.js');

var _defaultTetriminos2 = _interopRequireDefault(_defaultTetriminos);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var newRand = function newRand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var newShape = function newShape(room, rand) {
  var i = rand % _defaultTetriminos2.default.length;

  room.addShapesId(i + 2);
  return _defaultTetriminos2.default[i];
};

function initShapes(room) {
  room.addNewShape(newShape(room, newRand(1, _defaultTetriminos2.default.length)));
  room.addNewShape(newShape(room, newRand(1, _defaultTetriminos2.default.length)));
}

var createNewTetri = function createNewTetri(game, room) {
  game.addPlaced(1);
  if (game.getPlaced() >= room.getShapes().length - 1) room.addNewShape(newShape(room, newRand(1, _defaultTetriminos2.default.length)));
  game.setActualShape(room.getShapes(game.getPlaced()));
  game.setNextShape(room.getShapes(game.getPlaced() + 1));
  game.setId(room.getShapesId(game.getPlaced()));
  game.setNextId(room.getShapesId(game.getPlaced() + 1));
  game.setX(Math.trunc(game.getLines(0).length / 2 - game.getActualShape(0).length / 2));
  game.setY(-1);
};

var addTetri = function addTetri(game) {
  var i = -1;
  var j = -1;
  var x = game.getX();
  var y = game.getY();
  var id = game.getId();
  var actual = game.getActualShape();

  while (++i < actual.length) {
    while (++j < actual[0].length) {
      if (actual[i][j] === 1) game.setLines(y, x, id);
      x++;
    }
    x = game.getX();
    j = -1;
    y++;
  }
};

var checkTetri = function checkTetri(game, truePos) {
  var i = -1;
  var j = -1;
  var x = game.getX();
  var y = game.getY();
  var actual = game.getActualShape();

  if (x + truePos.x + truePos.lengthX > game.getLines(0).length || y + truePos.y + truePos.lengthY > game.getLines().length) return -1;
  while (++i < actual.length && i <= truePos.y + truePos.lengthY - 1) {
    while (++j < actual[i].length && j <= truePos.x + truePos.lengthX - 1) {
      if (game.getY() + i >= game.getLines().length || actual[i][j] === 1 && game.getLines(y, x) !== undefined && game.getLines(y, x) !== 0) return -1;
      x++;
    }
    j = -1;
    x = game.getX();
    y++;
  }
  return 1;
};

var noMoreSpace = function noMoreSpace(game) {
  if (game.getY() > 0) return true;
  return false;
};

var turnTetri = function turnTetri(game, dir) {
  var tmp = game.getActualShape();

  if (game.getId() === 5) return 1;
  if (dir) tmp = tmp.map(function (val, index) {
    return tmp.map(function (row) {
      return row[index];
    }).reverse();
  });else tmp = tmp.map(function (val, index) {
    return tmp.map(function (row) {
      return row[index];
    });
  }).reverse();
  game.setActualShape(tmp);
  return 0;
};

var parseLen = function parseLen(tab) {
  var counterX = [0, 0, 0, 0];
  var counterY = [0, 0, 0, 0];
  var x = 0;
  var y = 0;
  var i = -1;
  var j = -1;

  while (++i < tab.length) {
    while (++j < tab[i].length) {
      if (tab[i][j] === 1) {
        counterX[j] = 1;
        counterY[i] = 1;
      }
    }
    j = -1;
  }
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = counterX[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var val = _step.value;

      if (val === 1) x++;
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

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = counterY[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _val = _step2.value;

      if (_val === 1) y++;
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

  return [x, y];
};

var parseTruePos = function parseTruePos(tab) {
  var x = tab[0].length;
  var y = tab.length;
  var lengthX = 0;
  var lengthY = 0;
  var i = -1;
  var j = -1;

  while (++i < tab.length) {
    while (++j < tab[i].length) {
      if (tab[i][j] === 1) {
        if (j < x) x = j;
        if (i < y) y = i;
      }
    }
    j = -1;
  }

  var _parseLen = parseLen(tab);

  var _parseLen2 = _slicedToArray(_parseLen, 2);

  lengthX = _parseLen2[0];
  lengthY = _parseLen2[1];

  return { x: x, y: y, lengthX: lengthX, lengthY: lengthY };
};

var checkIfOk = function checkIfOk(game, x, y, truePos) {
  if (game.isWaiting()) return 0;
  if (game.getId() === 5 && x === 0 && y === 0) return 0;
  if (game.getX() + truePos.x + x < 0 || game.getX() + truePos.x + truePos.lengthX - 1 + x >= game.getLines(0).length) {
    return 0;
  }
  if (x === 0 && y === 0 && (truePos.lengthX < truePos.lengthY && game.getX() + truePos.x + truePos.lengthX - 1 > game.getLines(0).length || truePos.lengthY < truePos.lengthX && game.getY() + truePos.y + truePos.lengthY - 1 > game.getLines().length)) {
    return 0;
  }
  return 'ok';
};

var moveTetri = function moveTetri(game, x, y) {
  var truePos = void 0;
  var errors = void 0;

  if (x === 0 && y === 0) turnTetri(game, true);
  truePos = parseTruePos(game.getActualShape());
  errors = checkIfOk(game, x, y, truePos);
  if (errors !== 'ok') {
    if (x === 0 && y === 0) turnTetri(game, false);
    return errors;
  }
  game.addY(y);
  game.addX(x);
  if (checkTetri(game, truePos) === -1) {
    if (x === 0 && y !== 0 && noMoreSpace(game) === false) return -1;else {
      game.subY(y);
      game.subX(x);
      if (x === 0 && y === 0) turnTetri(game, false);
      if (x === 0) {
        if (x === 0 && y === 0) return 0;
        if (!game.isWaiting()) {
          game.setWaiting(true);
          addTetri(game);
        }
        return 1;
      }
    }
  }
  return 2;
};

var checkFilledLine = function checkFilledLine(game) {
  var i = -1;
  var count = 0;

  while (++i < game.getLines().length) {
    if (!game.getLines(i).includes(0) && !game.getLines(i).includes(1)) {
      game.removeFilledLine(i);
      i--;
      count++;
    }
  }
  return count;
};

var endGame = function endGame(room, id, res) {
  room.emitOnly('endGame', id);
  room.addOut(id);
  // if (res !== undefined)
  //   res();
};

function addFilledLine(room, exception, amount) {
  var players = room.getSio();

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = Object.keys(players)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var id = _step3.value;

      if (id !== exception && !room.isOut(id)) {
        for (var i = 0; i < amount; i++) {
          if (room.getListPlayers(id).getGame().getLines(0).find(function (elem) {
            elem !== 0;
          })) {
            endGame(room, id);
            break;
          } else {
            if (room.getListPlayers(id).getGame().getY() === 0) refresh(room.getListPlayers(id).getGame(), room, id);
            room.getListPlayers(id).getGame().subY(1);
            room.getListPlayers(id).getGame().fillLine();
            refresh(room.getListPlayers(id).getGame(), room, id);
            room.emitOnly('refreshVue', id, room.getListPlayers(id).getGame().formatIt(), room.createSpecList(id));
          }
        }
      }
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

function refresh(game, room, id) {
  var hasMoved = 0;
  var filledLines = 0;

  game.setWaiting(false);
  if (game.getPlaced() === -1) createNewTetri(game, room);
  hasMoved = moveTetri(game, 0, 1);
  if (hasMoved == -1) endGame(room, id);else if (hasMoved == 1) {
    if ((filledLines = checkFilledLine(game)) > 0) addFilledLine(room, id, filledLines);
    game.refreshSpec(game.getLines());
    createNewTetri(game, room);
    refresh(game, room, id);
  }
  return game;
}

exports.refresh = refresh;
exports.moveTetri = moveTetri;
exports.initShapes = initShapes;
exports.endGame = endGame;
exports.addTetri = addTetri;