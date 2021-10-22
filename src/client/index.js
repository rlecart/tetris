import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { combineReducers } from 'redux';

import NotFound from './components/NotFound';
import RoomContainer from './containers/RoomContainer';
import GameContainer from './containers/GameContainer';
import HomeContainer from './containers/HomeContainer';

import {
  HashRouter,
  Route,
  Switch
} from 'react-router-dom';

import socketReducer from './reducers/socketReducer.js';
import homeReducer from "./reducers/homeReducer.js";
import roomReducer from "./reducers/roomReducer.js";
import gameReducer from "./reducers/gameReducer.js";
import configureStore from './middleware/configureStore.js';

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
        <Route exact path='/' component={HomeContainer} />
        <Route exact path='/:room' component={RoomContainer} />
        <Route exact path='/:room/:game' component={GameContainer} />
        <Route component={NotFound} />
      </Switch>
    </HashRouter>
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));