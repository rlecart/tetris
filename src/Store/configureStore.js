import { combineReducers, createStore } from "redux";
import socketReducer from './Reducers/socketReducer';
import roomReducer from "./Reducers/roomReducer";
import homeReducer from "./Reducers/homeReducer";
import gameReducer from "./Reducers/gameReducer";

export default createStore(combineReducers({
  socketReducer,
  roomReducer,
  homeReducer,
  gameReducer,
}));