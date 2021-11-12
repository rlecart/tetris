'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _clientApi = require('../api/clientApi.js');

var _clientApi2 = _interopRequireDefault(_clientApi);

var _utils = require('../../misc/utils.js');

var _roomAction = require('../actions/roomAction.js');

var _gameAction = require('../actions/gameAction.js');

var _GameOverContainer = require('./GameOverContainer.js');

var _GameOverContainer2 = _interopRequireDefault(_GameOverContainer);

var _GamePanel = require('../components/GamePanel.js');

var _GamePanel2 = _interopRequireDefault(_GamePanel);

var _SpecListContainer = require('./SpecListContainer.js');

var _SpecListContainer2 = _interopRequireDefault(_SpecListContainer);

var _LinesContainer = require('./LinesContainer.js');

var _LinesContainer2 = _interopRequireDefault(_LinesContainer);

var _Display = require('../components/Display.js');

var _Display2 = _interopRequireDefault(_Display);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var GameContainer = function GameContainer(_ref) {
  var dispatch = _ref.dispatch,
      history = _ref.history,
      socketReducer = _ref.socketReducer,
      roomReducer = _ref.roomReducer,
      gameReducer = _ref.gameReducer;

  var isMounted = _react2.default.useRef(false);
  var loaded = _react2.default.useRef(false);
  var gameOverTimeout = _react2.default.useRef();

  var _React$useState = _react2.default.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isOut = _React$useState2[0],
      setIsOut = _React$useState2[1];

  var _React$useState3 = _react2.default.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      showGoBack = _React$useState4[0],
      setShowGoBack = _React$useState4[1];

  var eventDispatcher = function eventDispatcher(event) {
    console.log('event.key = ', event.key);
    if (event.key === "z") (0, _gameAction.acidMode)(dispatch);else if (event.key === 'ArrowRight') _clientApi2.default.move('right', roomReducer.url, socketReducer.socket);else if (event.key === 'ArrowLeft') _clientApi2.default.move('left', roomReducer.url, socketReducer.socket);else if (event.key === ' ') _clientApi2.default.move('down', roomReducer.url, socketReducer.socket);else if (event.key === 'ArrowUp') _clientApi2.default.move('turn', roomReducer.url, socketReducer.socket);else if (event.key === 'ArrowDown') _clientApi2.default.move('stash', roomReducer.url, socketReducer.socket);else if (event.key === 'c') {
      _clientApi2.default.askToEndGame(socketReducer.socket, roomReducer.url);
    }
  };

  _react2.default.useEffect(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (isMounted.current) {
              _context.next = 3;
              break;
            }

            _context.next = 3;
            return (0, _utils.canIStayHere)('game', { roomReducer: roomReducer, socketReducer: socketReducer }).then(function () {
              isMounted.current = true;
              socketReducer.socket.on('disconnect', function () {
                pleaseUnmountGame('completly');
                history.push('/');
              });
              socketReducer.socket.on('refreshVue', function (newGame, newSpec) {
                var ret = _extends({}, gameReducer, { spec: newSpec });
                if (newGame) ret = _extends({}, newGame, { spec: newSpec });
                (0, _gameAction.setNewGameInfo)(dispatch, ret);
                if (!loaded.current) {
                  window.addEventListener('keydown', eventDispatcher);
                  loaded.current = true;
                }
              });
              socketReducer.socket.on('refreshRoomInfo', function (newRoomInfo) {
                (0, _roomAction.setNewRoomInfo)(dispatch, newRoomInfo);
              });
              socketReducer.socket.on('nowChillOutDude', function (path) {
                pleaseUnmountGame('completly');
                history.replace(path);
              });
              socketReducer.socket.on('endGame', function () {
                window.removeEventListener('keydown', eventDispatcher);
                (0, _gameAction.stopAcidMode)(dispatch);
                setIsOut(true); // pour faire un ptit 'mdr t mor'
              });
              socketReducer.socket.on('theEnd', function (_ref3) {
                var winnerInfo = _ref3.winnerInfo;

                window.removeEventListener('keydown', eventDispatcher);
                gameOverTimeout.current = setTimeout(function () {
                  if (isMounted.current) setShowGoBack(true);
                }, 5000);
                (0, _gameAction.addWinner)(dispatch, winnerInfo);
              });
              if (!loaded.current) _clientApi2.default.readyToStart(socketReducer.socket, roomReducer.url);
            }).catch(function () {
              history.push('/');
            });

          case 3:
            return _context.abrupt('return', function () {
              socketReducer.socket.removeAllListeners();
              isMounted.current = false;
            });

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })), [gameReducer]);

  var pleaseUnmountGame = function pleaseUnmountGame(completly) {
    if (!(0, _utils.isEmpty)(socketReducer)) {
      if (!(0, _utils.isEmpty)(socketReducer.socket)) socketReducer.socket.removeAllListeners();
      if (completly) {
        if (loaded.current) {
          window.removeEventListener('keydown', eventDispatcher);
          loaded.current = false;
          clearTimeout(gameOverTimeout.current);
          gameOverTimeout.current = undefined;
        }
        (0, _gameAction.deleteGameData)(dispatch);
        (0, _gameAction.stopAcidMode)(dispatch);
      }
    }
  };

  var specList = gameReducer.spec && gameReducer.spec.length !== 0 ? [_react2.default.createElement(_SpecListContainer2.default, { specList: gameReducer.spec.slice(0, gameReducer.spec.length / 2) }), _react2.default.createElement(_SpecListContainer2.default, { specList: gameReducer.spec.slice(gameReducer.spec.length / 2) })] : [undefined, undefined];

  var gameOverDisplay = gameReducer.winner !== undefined ? _react2.default.createElement(_GameOverContainer2.default, {
    socketReducer: socketReducer,
    roomReducer: roomReducer,
    gameReducer: gameReducer,
    showGoBack: showGoBack,
    api: _clientApi2.default,
    pleaseUnmountGame: pleaseUnmountGame,
    history: history }) : undefined;

  var displayLines = gameReducer.lines ? _react2.default.createElement(_LinesContainer2.default, {
    lines: gameReducer.lines,
    lineClass: 'line',
    blocClass: 'lineBloc' }) : undefined;

  var nextTetri = gameReducer.tetri !== undefined ? _react2.default.createElement(_LinesContainer2.default, {
    lines: gameReducer.tetri.nextShape,
    lineClass: 'lineNext',
    blocClass: 'lineBlocNext',
    id: undefined,
    idTetri: gameReducer.tetri.nextId }) : undefined;

  return _react2.default.createElement(
    _react.Fragment,
    null,
    _react2.default.createElement(
      _Display2.default,
      null,
      specList[0],
      _react2.default.createElement(_GamePanel2.default, { displayLines: displayLines, nextTetri: nextTetri }),
      specList[1]
    ),
    gameOverDisplay
  );
};

var mapStateToProps = function mapStateToProps(state) {
  return state;
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(GameContainer);