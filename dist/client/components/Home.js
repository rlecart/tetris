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

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _socketAction = require('../actions/socketAction');

var _socketAction2 = _interopRequireDefault(_socketAction);

var _homeAction = require('../actions/homeAction');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Home = function Home(_ref) {
  var dispatch = _ref.dispatch,
      history = _ref.history,
      location = _ref.location,
      match = _ref.match,
      socketReducer = _ref.socketReducer,
      roomReducer = _ref.roomReducer,
      homeReducer = _ref.homeReducer,
      gameReducer = _ref.gameReducer;

  var _React$useState = _react2.default.useState(undefined),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      whichButton = _React$useState2[0],
      setWhichButton = _React$useState2[1];

  var handleChange = function handleChange(event) {
    var newProfil = homeReducer.profil;
    var newJoinUrl = homeReducer.joinUrl;

    if (event.target.name === 'name') newProfil = { name: event.target.value };else if (event.target.name === 'roomUrl') newJoinUrl = event.target.value;
    (0, _homeAction.setNewHomeInfo)(dispatch, {
      newProfil: newProfil,
      newJoinUrl: newJoinUrl,
      newOwner: undefined
    });
  };

  _react2.default.useEffect(function () {
    var socket = void 0;

    if (!socketReducer.socket) {
      console.log('socket vide');
      socket = (0, _socket2.default)('http://localhost:8000');
      (0, _socketAction2.default)(dispatch, socket);
    }
    return function () {
      return console.log('real unmount home');
    };
  }, []);

  var submitForm = function submitForm(event) {
    console.log('submit');
    event.preventDefault();
    if (whichButton === 'joinRoom') {
      _clientApi2.default.joinRoom(socketReducer.socket, homeReducer.profil, homeReducer.joinUrl).then(function (url) {
        (0, _homeAction.setNewHomeInfo)(dispatch, {
          newProfil: homeReducer.profil,
          newJoinUrl: url,
          newOwner: false
        });
        history.push('/#' + url + '[' + homeReducer.profil.name + ']');
      }).catch(function (err) {
        console.log(err);
      });
    } else if (whichButton === 'createRoom') {
      console.log(homeReducer.profil);
      _clientApi2.default.createRoom(socketReducer.socket, homeReducer.profil).then(function (url) {
        (0, _homeAction.setNewHomeInfo)(dispatch, {
          newProfil: homeReducer.profil,
          newJoinUrl: url,
          newOwner: true
        });
        history.push('/#' + url + '[' + homeReducer.profil.name + ']');
      });
    }
    setWhichButton(undefined);
  };

  return _react2.default.createElement(
    'div',
    { className: 'display' },
    _react2.default.createElement(
      'div',
      { className: 'homeMenu' },
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
        { className: 'bottomPanel' },
        _react2.default.createElement(
          'form',
          { onSubmit: function onSubmit(event) {
              return submitForm(event);
            } },
          _react2.default.createElement(
            'div',
            { className: 'blocMenu', id: 'home' },
            _react2.default.createElement(
              'div',
              { className: 'avatarSelector' },
              _react2.default.createElement('div', { className: 'avatarButton' }),
              _react2.default.createElement('div', { className: 'avatar' }),
              _react2.default.createElement('div', { className: 'avatarButton' })
            ),
            _react2.default.createElement('input', { className: 'nickname', type: 'text', name: 'name', pattern: '[A-Za-z-]{1,}', required: true, value: homeReducer.profil.name,
              onChange: function onChange(event) {
                return handleChange(event);
              } })
          ),
          _react2.default.createElement(
            'div',
            { className: 'blocMenu', id: 'home' },
            _react2.default.createElement('input', { className: 'roomUrl', type: 'text', name: 'roomUrl', required: whichButton === 'joinRoom', value: homeReducer.joinUrl,
              onChange: function onChange(event) {
                return handleChange(event);
              }, placeholder: 'URL' }),
            _react2.default.createElement(
              'button',
              { type: 'submit', className: 'roomButton', onClick: function onClick() {
                  return setWhichButton('joinRoom');
                } },
              _react2.default.createElement(
                'span',
                { className: 'textButton' },
                'Join room'
              )
            ),
            _react2.default.createElement(
              'button',
              { type: 'submit', className: 'roomButton', onClick: function onClick() {
                  return setWhichButton('createRoom');
                } },
              _react2.default.createElement(
                'span',
                { className: 'textButton' },
                'Create Room'
              )
            )
          )
        )
      )
    )
  );
};

var mapStateToProps = function mapStateToProps(state) {
  return state;
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(Home);