import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

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

const { socketReducer } = require('./Store/Reducers/socketReducer');
const { roomReducer } = require("./Store/Reducers/roomReducer");
const { homeReducer } = require("./Store/Reducers/homeReducer");
const { gameReducer } = require("./Store/Reducers/gameReducer");

const { configureStore } = require('./Store/configureStore');

const Root = () => {
  const Store = configureStore(combineReducers({
    socketReducer,
    roomReducer,
    homeReducer,
    gameReducer,
  }, undefined, {}));

  return (
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
};

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
