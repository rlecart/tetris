// import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { combineReducers } from 'redux';

import NotFound from './components/NotFound';
import Room from './components/Room';
import Game from './components/Game';
import Home from './components/Home';

import {
  HashRouter,
  Route,
  Switch
} from 'react-router-dom';

import socketReducer from './reducers/socketReducer';
import homeReducer from "./reducers/homeReducer";
import roomReducer from "./reducers/roomReducer";
import gameReducer from "./reducers/gameReducer";
import configureStore from './middleware/configureStore';

const Store = configureStore(combineReducers({
  socketReducer,
  roomReducer,
  homeReducer,
  gameReducer,
}, undefined, {}));

const Root = () => (
  <Provider store={Store}>
    <HashRouter hashType='noslash'>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/:room' component={Room} />
        <Route exact path='/:room/:game' component={Game} />
        <Route component={NotFound} />
      </Switch>
    </HashRouter>
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));