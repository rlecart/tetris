import './App.css';
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import openSocket from 'socket.io-client';

import Home from "./vues/Home";

class App extends Component {
  componentDidMount() {
    let sock;

    if (!this.props.socketConnector.isSocketConnected) {
      sock = openSocket('http://localhost:8000');
      const action = { type: 'CONNECT_SOCKET', value: sock };
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