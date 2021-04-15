import logo from './logo.svg';
import './App.css';
import React, { Component, Fragment } from 'react'

import colors from './ressources/colors.js'
import { move } from './api/clientApi.js'
import openSocket from 'socket.io-client'
import Game from './vues/Game'
import Room from "./vues/Room"
import Accueil from "./vues/Accueil"

class App extends Component {
  render() {
    let vue = undefined
    if (1) {
      vue = <Accueil />
    }
    else {
      vue = <Room />
    }
    return (
      <Fragment>
        {vue}
      </Fragment>
    )
  }
}

export default App
