import logo from './logo.svg';
import './App.css';
import React, { Component, Fragment } from 'react'

import colors from './ressources/colors.js'
import { move } from './api/clientApi.js'
import openSocket from 'socket.io-client'
import Game from './vues/Game'
import Room from "./vues/Room"
import Accueil from "./vues/Accueil"

import { connect } from "react-redux";

class App extends Component {
  state = {
  }

  componentDidMount() { // checker si socket existant
    // fonction pour set toutes les reponses serv
    // console.log('\n\n\nquoiouibonjourquoiouibonjourquoiouibonjourquoiouibonjourquoiouibonjourquoiouibonjourquoiouibonjourquoiouibonjourquoiouibonjour\n\n\n')
    let sock

    // console.log(this.props.socketConnector)
    // if (!this.props.socketConnector.socket) { // ici ca cree un nouveau socket a chaque retour arriere lors d'un leaveRoom()
    console.log('LE SOCKET OMG LE SOCKET OLALA')
    console.log(this.props.socketConnector)
    if (!this.props.socketConnector.isSocketConnected) {
      sock = openSocket('http://localhost:8000')
      const action = { type: 'CONNECT_SOCKET', value: sock }
      this.props.dispatch(action)
    }
    // }
    // this.socket.on('')
  }

  render() {
    console.log('app props', this.props)
    return (
      <Fragment>
        <Accueil history={this.props.history} />
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(App)