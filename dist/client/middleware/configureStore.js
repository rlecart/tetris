"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require("redux");

var configureStore = function configureStore(reducer, initialState, types) {
  return (0, _redux.createStore)(reducer, initialState, (0, _redux.applyMiddleware)(myMiddleware(types)));
};

var isFunction = function isFunction(arg) {
  return typeof arg === 'function';
};

var myMiddleware = function myMiddleware() {
  var types = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var fired = {};

  return function (store) {
    return function (next) {
      return function (action) {
        var result = next(action);
        var cb = types[action.type];

        if (cb && !fired[action.type]) {
          if (!isFunction(cb)) throw new Error("action's type value must be a function");
          fired[action.type] = true;
          cb({ getState: store.getState, dispatch: store.dispatch, action: action });
        }
        return result;
      };
    };
  };
};

exports.default = configureStore;