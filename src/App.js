import './App.css';
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import openSocket from 'socket.io-client';

import Accueil from "./vues/Accueil";

class App extends Component {
  state = {
  };

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
        <Accueil history={this.props.history} />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(App);