const { applyMiddleware, createStore } = require("redux");
const { myMiddleware } = require('./myMiddleware');

const configureStore = (reducer, initialState, types) => createStore(
  reducer,
  initialState,
  applyMiddleware(
    myMiddleware(types)
  )
);

module.exports = { configureStore };