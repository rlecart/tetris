'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _defaultColors = require('../ressources/defaultColors.js');

var _defaultColors2 = _interopRequireDefault(_defaultColors);

var _clientApi = require('../api/clientApi.js');

var _clientApi2 = _interopRequireDefault(_clientApi);

var _utils = require('../misc/utils.js');

var _roomAction = require('../actions/roomAction.js');

var _gameAction = require('../actions/gameAction.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Game = function Game(_ref) {
  var dispatch = _ref.dispatch,
      history = _ref.history,
      location = _ref.location,
      match = _ref.match,
      socketReducer = _ref.socketReducer,
      roomReducer = _ref.roomReducer,
      homeReducer = _ref.homeReducer,
      gameReducer = _ref.gameReducer;

  var isMounted = _react2.default.useRef(false);
  var loaded = _react2.default.useRef(false);

  var _React$useState = _react2.default.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isOut = _React$useState2[0],
      setIsOut = _React$useState2[1];

  var _React$useState3 = _react2.default.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      showGoBack = _React$useState4[0],
      setShowGoBack = _React$useState4[1];

  var createbloc = function createbloc(bloc, blocClass, id, idTetri) {
    var col = idTetri && bloc !== 0 ? idTetri : bloc;

    return _react2.default.createElement('div', { className: blocClass, id: id, style: { backgroundColor: _defaultColors2.default[col] } });
  };

  var createLine = function createLine(line, blocClass, id, idTetri) {
    var ret = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = line[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var bloc = _step.value;

        ret.push(createbloc(bloc, blocClass, id, idTetri));
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
  };

  var createLines = function createLines(lines, lineClass, blocClass, id, idTetri) {
    var ret = [];

    if (idTetri === 5 && lines.length < 3) lines.unshift(new Array(lines[0].length).fill(0));
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = lines[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var line = _step2.value;

        ret.push(_react2.default.createElement(
          'div',
          { className: lineClass },
          createLine(line, blocClass, id, idTetri)
        ));
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

    return ret;
  };

  var acidMode = function acidMode() {
    console.log('gamereduc = ', gameReducer);
    var newDisplayLines = gameReducer.lines;

    for (var line in newDisplayLines) {
      for (var char in newDisplayLines[line]) {
        // newDisplayLines[line][char]++;
        newDisplayLines[line][char] = (newDisplayLines[line][char] + 1) % 9;
      }
    }
    (0, _gameAction.setNewGameInfo)(dispatch, _extends({}, gameReducer, { lines: newDisplayLines }));
  };

  var eventDispatcher = function eventDispatcher(event) {
    console.log(event.key);
    if (event.key === "z") acidMode();else if (event.key === 'ArrowRight') _clientApi2.default.move('right', roomReducer.url, socketReducer.socket);else if (event.key === 'ArrowLeft') _clientApi2.default.move('left', roomReducer.url, socketReducer.socket);else if (event.key === ' ') _clientApi2.default.move('down', roomReducer.url, socketReducer.socket);else if (event.key === 'ArrowUp') _clientApi2.default.move('turn', roomReducer.url, socketReducer.socket);else if (event.key === 'ArrowDown') _clientApi2.default.move('stash', roomReducer.url, socketReducer.socket);else if (event.key === 'c') {
      _clientApi2.default.askToEndGame(socketReducer.socket, roomReducer.url);
    }
  };

  _react2.default.useEffect(function () {
    isMounted.current = true;
    (0, _utils.canIStayHere)('game', { roomReducer: roomReducer, socketReducer: socketReducer }).then(function () {
      console.log('ca useEffectttttttttttttttttttttttttttttttttttttttt');
      if (!loaded.current) {
        socketReducer.socket.on('disconnect', function () {
          pleaseUnmountGame();
          history.push('/');
        });
        socketReducer.socket.on('refreshVue', function (newGame, newSpec) {
          console.log('ca refresh front', gameReducer);
          (0, _gameAction.setNewGameInfo)(dispatch, _extends({}, newGame, { spec: newSpec }));
          if (!loaded.current) {
            window.addEventListener('keydown', eventDispatcher);
            loaded.current = true;
          }
        });
        socketReducer.socket.on('refreshRoomInfo', function (newRoomInfo) {
          (0, _roomAction.setNewRoomInfo)(dispatch, newRoomInfo);
        });
        socketReducer.socket.on('nowChillOutDude', function (path) {
          pleaseUnmountGame();
          history.replace(path);
        });
        socketReducer.socket.on('endGame', function () {
          console.log('unload', gameReducer);
          window.removeEventListener('keydown', eventDispatcher);
          setIsOut(true); // pour faire un ptit 'mdr t mor'
        });
        socketReducer.socket.on('theEnd', function (_ref2) {
          var winnerInfo = _ref2.winnerInfo;

          console.log('the end', winnerInfo);
          setTimeout(function () {
            if (isMounted.current) setShowGoBack(true);
          }, 5000);
          (0, _gameAction.addWinner)(dispatch, winnerInfo);
        });
        console.log('DidMount du game');
        if (!loaded.current) _clientApi2.default.readyToStart(socketReducer.socket, roomReducer.url);
      }
    }, function () {
      history.push('/');
    });
    return function () {
      return isMounted.current = false;
    };
  }, []);

  var pleaseUnmountGame = function pleaseUnmountGame() {
    if (!(0, _utils.isEmpty)(socketReducer)) {
      if (!(0, _utils.isEmpty)(socketReducer.socket)) socketReducer.socket.removeAllListeners();
      if (loaded.current) {
        window.removeEventListener('keydown', eventDispatcher);
        loaded.current = false;
        // dispatch({ type: 'UNLOAD_GAME' });
      }
      (0, _gameAction.deleteGameData)();
      // keydownLoader('UNLOAD');
      // loaded.current = false;
    }
  };

  var createSpec = function createSpec(players) {
    var ret = [];

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = players[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var player = _step3.value;

        ret.push(_react2.default.createElement(
          'div',
          { className: 'blocSpec' },
          _react2.default.createElement(
            'div',
            { className: 'board', id: 'spec' },
            createLines(player.lines, 'line', 'lineBloc', 'spec')
          ),
          _react2.default.createElement(
            'div',
            { className: 'nicknameSpec' },
            player.name
          )
        ));
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

    return ret;
  };

  var createGameOverDisplay = function createGameOverDisplay() {
    var returnToRoomButton = roomReducer.owner === socketReducer.socket.id ? _react2.default.createElement(
      'button',
      { className: 'roomButton', id: 'leaveGame', onClick: function onClick() {
          _clientApi2.default.askEverybodyToCalmDown(socketReducer.socket, roomReducer.url);
          // pleaseUnmountGame();
        } },
      _react2.default.createElement(
        'span',
        { className: 'textButton' },
        'flex'
      )
    ) : undefined;
    var goBack = showGoBack === true && !(roomReducer.owner === socketReducer.socket.id) ? _react2.default.createElement(
      'button',
      { className: 'roomButton', id: 'leaveGame', onClick: function onClick() {
          var profil = roomReducer.listPlayers[socketReducer.socket.id]._profil;
          pleaseUnmountGame();
          history.replace('/' + roomReducer.url + '[' + profil.name + ']');
        } },
      _react2.default.createElement(
        'span',
        { className: 'textButton' },
        'Go back'
      )
    ) : undefined;

    if (gameReducer.winner !== undefined) {
      var finalText;

      if (!(0, _utils.isEmpty)(gameReducer.winner)) {
        finalText = gameReducer.winner.id === socketReducer.socket.id ? _react2.default.createElement(
          _react.Fragment,
          null,
          _react2.default.createElement(
            'span',
            { className: 'textButton', id: 'gameOverTextReveal' },
            'what a pro you are, such a nice musculature!!! :Q'
          ),
          _react2.default.createElement(
            'span',
            { className: 'textButton', id: 'gameOverTextReveal' },
            'YOU are the real beaugosse!'
          )
        ) : _react2.default.createElement(
          _react.Fragment,
          null,
          _react2.default.createElement(
            'span',
            { className: 'textButton', id: 'gameOverTextReveal' },
            'but you lose, like the looser you are! :((('
          ),
          _react2.default.createElement(
            'span',
            { className: 'textButton', id: 'gameOverTextReveal' },
            gameReducer.winner.name,
            ' is the real beaugosse!'
          )
        );
      }

      return _react2.default.createElement(
        'div',
        { className: 'gameOverDisplay' },
        _react2.default.createElement(
          'div',
          { className: 'gameOverLayout' },
          _react2.default.createElement(
            'div',
            { className: 'gameOverTitle' },
            _react2.default.createElement(
              'span',
              { className: 'textButton', id: 'gameOverText' },
              'OMG GG WP DUUUDE'
            ),
            finalText
          ),
          _react2.default.createElement(
            'div',
            { className: 'bottomButtons' },
            returnToRoomButton,
            goBack
          )
        )
      );
    }
  };

  var specList = gameReducer.spec && gameReducer.spec.length !== 0 ? [gameReducer.spec.slice(0, gameReducer.spec.length / 2), gameReducer.spec.slice(gameReducer.spec.length / 2)] : undefined;
  var gameOverDisplay = gameReducer.winner !== undefined ? createGameOverDisplay() : undefined;

  return _react2.default.createElement(
    _react.Fragment,
    null,
    _react2.default.createElement(
      'div',
      { className: 'display' },
      _react2.default.createElement(
        'div',
        { className: 'game', id: 'spec' },
        _react2.default.createElement(
          'div',
          { className: 'spec' },
          specList ? createSpec(specList[0]) : undefined
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'game' },
        _react2.default.createElement(
          'div',
          { className: 'board' },
          gameReducer.lines ? createLines(gameReducer.lines, 'line', 'lineBloc') : undefined
        ),
        _react2.default.createElement(
          'div',
          { className: 'rightPanel' },
          _react2.default.createElement(
            'div',
            { className: 'nextText' },
            'NEXT :'
          ),
          _react2.default.createElement(
            'div',
            { className: 'nextPiece' },
            gameReducer.tetri !== undefined ? createLines(gameReducer.tetri.nextShape, 'lineNext', 'lineBlocNext', undefined, gameReducer.tetri.nextId) : undefined
          ),
          _react2.default.createElement(
            'div',
            { className: 'score' },
            'Score :',
            _react2.default.createElement('br', null),
            '00'
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'game', id: 'spec' },
        _react2.default.createElement(
          'div',
          { className: 'spec' },
          specList ? createSpec(specList[1]) : undefined
        )
      )
    ),
    gameOverDisplay
  );
};

var mapStateToProps = function mapStateToProps(state) {
  return state;
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(Game);