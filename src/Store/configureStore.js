import { applyMiddleware, createStore } from "redux";
import myMiddleware from './myMiddleware.js';

const configureStore = (reducer, initialState, types) => createStore(
  reducer,
  initialState,
  applyMiddleware(
    myMiddleware(types)
  )
);

export default configureStore;