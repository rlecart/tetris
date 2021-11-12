import React from 'react';
import { render as enzymeRender } from 'enzyme';
import configureStore from "../../src/client/middleware/configureStore.js";
import { Provider } from 'react-redux';

import socketReducer from '../../src/client/reducers/socketReducer.js';
import homeReducer from "../../src/client/reducers/homeReducer.js";
import roomReducer from "../../src/client/reducers/roomReducer.js";
import gameReducer from "../../src/client/reducers/gameReducer.js";
import { combineReducers } from 'redux';


function render(
  ui,
  {
    preloadedState,
    store = configureStore(combineReducers({
      socketReducer,
      roomReducer,
      homeReducer,
      gameReducer,
    }, undefined, {})),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return enzymeRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export { render };