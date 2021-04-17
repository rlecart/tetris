import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import NotFound from './components/NotFound'
import App from './App';
import Room from './vues/Room';
import Game from './vues/Game';

import history from './misc/history'

import {
  Router,
  Route,
  Switch
} from 'react-router-dom'

const Root = () => (
  <Router history={history}>
    <Switch>
      <Route exact path='/' component={App} />
      <Route path='/room' component={Room} />
      <Route exact path='/game' component={Game} />
      <Route component={NotFound} />
    </Switch>
  </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
