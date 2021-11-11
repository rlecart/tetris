'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _NotFound = require('./components/NotFound');

var _NotFound2 = _interopRequireDefault(_NotFound);

var _Room = require('./components/Room');

var _Room2 = _interopRequireDefault(_Room);

var _Game = require('./components/Game');

var _Game2 = _interopRequireDefault(_Game);

var _Home = require('./components/Home');

var _Home2 = _interopRequireDefault(_Home);

var _reactRouterDom = require('react-router-dom');

var _socketReducer = require('./reducers/socketReducer');

var _socketReducer2 = _interopRequireDefault(_socketReducer);

var _homeReducer = require('./reducers/homeReducer');

var _homeReducer2 = _interopRequireDefault(_homeReducer);

var _roomReducer = require('./reducers/roomReducer');

var _roomReducer2 = _interopRequireDefault(_roomReducer);

var _gameReducer = require('./reducers/gameReducer');

var _gameReducer2 = _interopRequireDefault(_gameReducer);

var _configureStore = require('./middleware/configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import './App.css';
var Store = (0, _configureStore2.default)((0, _redux.combineReducers)({
  socketReducer: _socketReducer2.default,
  roomReducer: _roomReducer2.default,
  homeReducer: _homeReducer2.default,
  gameReducer: _gameReducer2.default
}, undefined, {}));

var Root = function Root() {
  return _react2.default.createElement(
    _reactRedux.Provider,
    { store: Store },
    _react2.default.createElement(
      _reactRouterDom.HashRouter,
      { hashType: 'noslash' },
      _react2.default.createElement(
        _reactRouterDom.Switch,
        null,
        _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/', component: _Home2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/:room', component: _Room2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/:room/:game', component: _Game2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { component: _NotFound2.default })
      )
    )
  );
};

_reactDom2.default.render(_react2.default.createElement(Root, null), document.getElementById('root'));