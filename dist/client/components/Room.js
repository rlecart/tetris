'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _clientApi = require('../api/clientApi');

var _clientApi2 = _interopRequireDefault(_clientApi);

var _utils = require('../misc/utils.js');

var _roomAction = require('../actions/roomAction');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Room = function Room(_ref) {
  var dispatch = _ref.dispatch,
      history = _ref.history,
      location = _ref.location,
      match = _ref.match,
      socketReducer = _ref.socketReducer,
      roomReducer = _ref.roomReducer,
      homeReducer = _ref.homeReducer,
      gameReducer = _ref.gameReducer;

  var loaded = (0, _react.useRef)(false);

  var createList = function createList() {
    var ret = [];

    if (roomReducer && roomReducer.listPlayers) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.values(roomReducer.listPlayers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var player = _step.value;

          ret.push(_react2.default.createElement(
            'div',
            { className: 'player' },
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
      { className: 'roomButton', id: 'leaveLaunch', onClick: function onClick() {
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
    if (completly) (0, _roomAction.deleteRoomData)();
    loaded.current = false;
    console.log('unmount room', roomReducer);
  };

  _react2.default.useEffect(function () {
    (0, _utils.canIStayHere)('room', { roomReducer: roomReducer, homeReducer: homeReducer, socketReducer: socketReducer }).then(function () {
      console.log('mount room', roomReducer);
      if (!loaded.current) {
        socketReducer.socket.on('disconnect', function () {
          pleaseUnmountRoom('completly');
          history.push('/');
        });
        socketReducer.socket.on('goToGame', function () {
          pleaseUnmountRoom();
          history.push(location.pathname + '/game');
        });
        socketReducer.socket.on('refreshRoomInfo', function (newRoomInfo) {
          (0, _roomAction.setNewRoomInfo)(dispatch, newRoomInfo);
        });
        _clientApi2.default.getRoomInfo(socketReducer.socket, homeReducer.joinUrl).then(function (newRoomInfo) {
          (0, _roomAction.setNewRoomInfo)(dispatch, newRoomInfo);
        });
        loaded.current = true;
      }
    }, function () {
      history.push('/');
    });

    return function () {
      console.log('real unmount room');
    };
  }, []);

  var players = createList();
  var startGame = ifOwner();

  return _react2.default.createElement(
    'div',
    { className: 'display' },
    _react2.default.createElement(
      'div',
      { className: 'homeMenu', id: 'inRoom' },
      _react2.default.createElement(
        'div',
        { className: 'topPanel' },
        _react2.default.createElement(
          'span',
          { className: 'title' },
          'Super Tetris 3000'
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'bottomPanel', id: 'inRoom' },
        _react2.default.createElement('div', { className: 'blocMenu', id: 'rules' }),
        _react2.default.createElement(
          'div',
          { className: 'blocMenu', id: 'listPlayers' },
          _react2.default.createElement(
            'div',
            { className: 'playerList' },
            players
          ),
          _react2.default.createElement(
            'div',
            { className: 'bottomButtons' },
            _react2.default.createElement(
              'button',
              { className: 'roomButton', id: 'leaveLaunch', onClick: function onClick() {
                  _clientApi2.default.leaveRoom(socketReducer.socket, roomReducer.url).then(function () {
                    pleaseUnmountRoom('completly');
                    history.replace('/');
                  });
                } },
              _react2.default.createElement(
                'span',
                { className: 'textButton' },
                'Quitter'
              )
            ),
            startGame
          )
        )
      )
    )
  );
};

var mapStateToProps = function mapStateToProps(state) {
  return state;
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(Room);