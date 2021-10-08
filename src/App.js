import './App.css';
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import openSocket from 'socket.io-client';

import Home from "./components/Home";
import { isEmpty } from './misc/utils';

class App extends Component {
  componentDidMount() {
    let socket;

    if (!this.props.socketReducer.socket) {
      console.log('socket vide')
      socket = openSocket('http://localhost:8000');
      const action = { type: 'CONNECT_SOCKET', value: socket };
      this.props.dispatch(action);
    }
  }

  render() {
    return (
      <Fragment>
        <Home history={this.props.history} />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(App);