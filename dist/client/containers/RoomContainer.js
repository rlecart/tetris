'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _clientApi = require('../api/clientApi');

var _clientApi2 = _interopRequireDefault(_clientApi);

var _utils = require('../../misc/utils.js');

var _roomAction = require('../actions/roomAction');

var _TopPanel = require('../components/TopPanel');

var _TopPanel2 = _interopRequireDefault(_TopPanel);

var _BottomPanel = require('../components/BottomPanel');

var _BottomPanel2 = _interopRequireDefault(_BottomPanel);

var _RulesPanel = require('../components/RulesPanel');

var _RulesPanel2 = _interopRequireDefault(_RulesPanel);

var _PlayersPanel = require('../components/PlayersPanel');

var _PlayersPanel2 = _interopRequireDefault(_PlayersPanel);

var _Display = require('../components/Display');

var _Display2 = _interopRequireDefault(_Display);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var RoomContainer = function RoomContainer(_ref) {
  var dispatch = _ref.dispatch,
      history = _ref.history,
      location = _ref.location,
      socketReducer = _ref.socketReducer,
      roomReducer = _ref.roomReducer,
      homeReducer = _ref.homeReducer;

  var loaded = (0, _react.useRef)(false);

  var createList = function createList() {
    var ret = [];

    if (roomReducer && roomReducer.listPlayers) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.entries(roomReducer.listPlayers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              player = _step$value[1];

          ret.push(_react2.default.createElement(
            'div',
            { className: 'player', key: key },
            player._profil.name
          ));
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
  };

  var ifOwner = function ifOwner() {
    if (roomReducer && roomReducer.owner && socketReducer.socket.id === roomReducer.owner) return _react2.default.createElement(
      'button',
      { className: 'roomButton', id: 'launch', onClick: function onClick() {
          _clientApi2.default.askToStartGame(socketReducer.socket, roomReducer.url);
        } },
      _react2.default.createElement(
        'span',
        { className: 'textButton' },
        'Lancer la partie'
      )
    );
  };

  var pleaseUnmountRoom = function pleaseUnmountRoom(completly) {
    if (!(0, _utils.isEmpty)(socketReducer) && !(0, _utils.isEmpty)(socketReducer.socket)) {
      socketReducer.socket.removeAllListeners();
    }
    if (completly) (0, _roomAction.deleteRoomData)(dispatch);
    loaded.current = false;
    // console.log('unmount room', roomReducer);
  };

  _react2.default.useEffect(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _utils.canIStayHere)('room', { roomReducer: roomReducer, homeReducer: homeReducer, socketReducer: socketReducer }).then(function () {
              // console.log('mount room');
              socketReducer.socket.on('disconnect', function () {
                pleaseUnmountRoom('completly');
                // console.log('ca disconnect');
                history.push('/');
              });
              socketReducer.socket.on('goToGame', function () {
                pleaseUnmountRoom();
                // console.log('ca go to game');
                history.push(location.pathname + '/game');
              });
              socketReducer.socket.on('refreshRoomInfo', function (newRoomInfo) {
                // console.log(roomReducer);
                // console.log('ca refresh car new info room', newRoomInfo);
                (0, _roomAction.setNewRoomInfo)(dispatch, newRoomInfo);
              });
              if (!loaded.current) {
                _clientApi2.default.getRoomInfo(socketReducer.socket, homeReducer.joinUrl).then(function (newRoomInfo) {
                  // console.log('\nca get');
                  // console.log('ca get');
                  // console.log('ca get');
                  // console.log('ca get');
                  // console.log('ca get');
                  // console.log(newRoomInfo, roomReducer, '\n');
                  (0, _roomAction.setNewRoomInfo)(dispatch, newRoomInfo);
                  // console.log('ca get 1 fois', newRoomInfo);
                  // console.log('ca get 1 fois', roomReducer);
                }).catch(function (err) {
                  pleaseUnmountRoom('completly');
                  // console.log('ca arrive pas a getRoom');
                  history.push('/');
                });
                loaded.current = true;
              }
            }).catch(function () {
              // console.log('ca cantstayhere');
              history.push('/');
            });

          case 2:
            return _context.abrupt('return', function () {
              socketReducer.socket.removeAllListeners();
              // console.log('real unmount room');
            });

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })), [roomReducer]);

  var leaveRoom = function leaveRoom() {

    // console.log('roomReducer = ', roomReducer);
    _clientApi2.default.leaveRoom(socketReducer.socket, roomReducer.url).then(function () {
      // console.log('ca leaveRoom');
      pleaseUnmountRoom('completly');
      history.replace('/');
    }).catch(function () {
      // console.log('ca leave pas Room');
    });
  };

  var players = createList();
  var startGameButton = ifOwner();

  return _react2.default.createElement(
    _Display2.default,
    null,
    _react2.default.createElement(
      'div',
      { className: 'homeMenu', id: 'inRoom' },
      _react2.default.createElement(_TopPanel2.default, null),
      _react2.default.createElement(
        _BottomPanel2.default,
        { id: 'inRoom' },
        _react2.default.createElement(_RulesPanel2.default, null),
        _react2.default.createElement(_PlayersPanel2.default, {
          players: players,
          startGameButton: startGameButton,
          leaveRoom: leaveRoom
        })
      )
    )
  );
};

var mapStateToProps = function mapStateToProps(state) {
  return state;
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(RoomContainer);