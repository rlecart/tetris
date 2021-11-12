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

var _homeAction = require('../actions/homeAction');

var _ProfilPanel = require('../components/ProfilPanel');

var _ProfilPanel2 = _interopRequireDefault(_ProfilPanel);

var _TopPanel = require('../components/TopPanel');

var _TopPanel2 = _interopRequireDefault(_TopPanel);

var _BottomPanel = require('../components/BottomPanel');

var _BottomPanel2 = _interopRequireDefault(_BottomPanel);

var _RoomSelectorPanel = require('../components/RoomSelectorPanel');

var _RoomSelectorPanel2 = _interopRequireDefault(_RoomSelectorPanel);

var _Display = require('../components/Display');

var _Display2 = _interopRequireDefault(_Display);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Home = function Home(_ref) {
  var dispatch = _ref.dispatch,
      history = _ref.history,
      socketReducer = _ref.socketReducer,
      homeReducer = _ref.homeReducer;

  var _React$useState = _react2.default.useState(undefined),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      whichButton = _React$useState2[0],
      setWhichButton = _React$useState2[1];

  var handleChange = function handleChange(event) {
    var newProfil = homeReducer.profil;
    var newJoinUrl = homeReducer.joinUrl;

    if (event && event.target && (event.target.name === 'name' || event.target.name === 'roomUrl')) {
      if (event.target.name === 'name') newProfil = { name: event.target.value };else if (event.target.name === 'roomUrl') newJoinUrl = event.target.value;
      (0, _homeAction.setNewHomeInfo)(dispatch, {
        newProfil: newProfil,
        newJoinUrl: newJoinUrl,
        newOwner: undefined
      });
    }
  };

  _react2.default.useEffect(function () {
    var socket = void 0;

    if (!socketReducer.socket) {
      // console.log('socket vide');
      socket = (0, _socket2.default)('http://0.0.0.0:3004');
      (0, _socketAction.addSocket)(dispatch, socket);
    }
    return function () {
      //console.log('real unmount home')
    };
  }, []);

  var submitForm = function submitForm(event) {
    return new Promise(function (res, rej) {
      event.preventDefault();
      if (whichButton === 'joinRoom') {
        setWhichButton(undefined);
        _clientApi2.default.joinRoom(socketReducer.socket, homeReducer.profil, homeReducer.joinUrl).then(function (url) {
          (0, _homeAction.setNewHomeInfo)(dispatch, {
            newProfil: homeReducer.profil,
            newJoinUrl: url,
            newOwner: false
          });
          history.push('/#' + url + '[' + homeReducer.profil.name + ']');
          res();
        }).catch(function (err) {
          rej(err);
        });
      } else if (whichButton === 'createRoom') {
        setWhichButton(undefined);
        _clientApi2.default.createRoom(socketReducer.socket, homeReducer.profil).then(function (url) {
          (0, _homeAction.setNewHomeInfo)(dispatch, {
            newProfil: homeReducer.profil,
            newJoinUrl: url,
            newOwner: true
          });
          history.push('/#' + url + '[' + homeReducer.profil.name + ']');
          res();
        }).catch(function (err) {
          rej(err);
        });
      } else res();
    });
  };

  return _react2.default.createElement(
    _Display2.default,
    null,
    _react2.default.createElement(
      'div',
      { className: 'homeMenu' },
      _react2.default.createElement(_TopPanel2.default, null),
      _react2.default.createElement(
        _BottomPanel2.default,
        null,
        _react2.default.createElement(
          'form',
          { onSubmit: submitForm },
          _react2.default.createElement(_ProfilPanel2.default, {
            homeReducer: homeReducer,
            handleChange: handleChange
          }),
          _react2.default.createElement(_RoomSelectorPanel2.default, {
            homeReducer: homeReducer,
            whichButton: whichButton,
            setWhichButton: setWhichButton,
            handleChange: handleChange
          })
        )
      )
    )
  );
};

var mapStateToProps = function mapStateToProps(state) {
  return state;
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(Home);