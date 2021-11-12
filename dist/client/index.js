'use strict';

require('../style/App.css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _NotFound = require('./components/NotFound');

var _NotFound2 = _interopRequireDefault(_NotFound);

var _RoomContainer = require('./containers/RoomContainer');

var _RoomContainer2 = _interopRequireDefault(_RoomContainer);

var _GameContainer = require('./containers/GameContainer');

var _GameContainer2 = _interopRequireDefault(_GameContainer);

var _HomeContainer = require('./containers/HomeContainer');

var _HomeContainer2 = _interopRequireDefault(_HomeContainer);

var _reactRouterDom = require('react-router-dom');

var _socketReducer = require('./reducers/socketReducer.js');

var _socketReducer2 = _interopRequireDefault(_socketReducer);

var _homeReducer = require('./reducers/homeReducer.js');

var _homeReducer2 = _interopRequireDefault(_homeReducer);

var _roomReducer = require('./reducers/roomReducer.js');

var _roomReducer2 = _interopRequireDefault(_roomReducer);

var _gameReducer = require('./reducers/gameReducer.js');

var _gameReducer2 = _interopRequireDefault(_gameReducer);

var _configureStore = require('./middleware/configureStore.js');

var _configureStore2 = _interopRequireDefault(_configureStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/', component: _HomeContainer2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/:room', component: _RoomContainer2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/:room/:game', component: _GameContainer2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { component: _NotFound2.default })
      )
    )
  );
};

_reactDom2.default.render(_react2.default.createElement(Root, null), document.getElementById('root'));