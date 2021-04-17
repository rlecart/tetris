import logo from './logo.svg';
import './App.css';
import React, { Component, Fragment } from 'react'
import { Provider } from 'react-redux'
import Store from './Store/configureStore'

import colors from './ressources/colors.js'
import { move } from './api/clientApi.js'
import openSocket from 'socket.io-client'
import Game from './vues/Game'
import Room from "./vues/Room"
import Accueil from "./vues/Accueil"

class App extends Component {
  socket = openSocket('http://localhost:8000')
  state = {
    vueId: 0
  }

  componentDidMount() {
    // fonction pour set toutes les reponses serv

    // this.socket.on('')
  }

  render() {
    return (
      <Fragment>
        {/* <Provider store={Store}> */}
          <Accueil socket={this.socket} history={this.props.history}/>
        {/* </Provider> */}
      </Fragment>
    )
  }
}

export default App
