import { combineReducers, createStore } from "redux";
import socketConnector from './Reducers/socketConnector'
import roomReducer from "./Reducers/roomReducer";
import homeReducer from "./Reducers/homeReducer";

export default createStore(combineReducers({socketConnector, roomReducer, homeReducer}))