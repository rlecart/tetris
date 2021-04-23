import { combineReducers, createStore } from "redux";
import socketConnector from './Reducers/socketConnector'
import roomReducer from "./Reducers/roomReducer";

export default createStore(combineReducers({socketConnector, roomReducer}))