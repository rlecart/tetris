import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import Store from './Store/configureStore';

import NotFound from './components/NotFound';
import App from './App';
import Room from './vues/Room';
import Game from './vues/Game';

import {
  HashRouter,
  Route,
  Switch
} from 'react-router-dom';

const Root = () => (
  <Provider store={Store}>
    <HashRouter hashType='noslash'>
      <Switch>
        <Route exact path='/' component={App} />
        <Route exact path='/:room' component={Room} />
        <Route exact path='/:room/:game' component={Game} />
        <Route component={NotFound} />
      </Switch>
    </HashRouter>
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
