import logo from './logo.svg';
import './App.css';
import React, { Component, Fragment } from 'react'

import colors from './ressources/colors.js'
import { move } from './api.js'
import openSocket from 'socket.io-client'

class App extends Component {
  socket = openSocket('http://localhost:8000');
  state = {
    lines: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  }

  createbloc(bloc) {
    return <td className='lineBloc' style={{ backgroundColor: colors[bloc] }} />
  }

  createLine(line) {
    let ret = []
    for (let bloc of line) {
      ret.push(this.createbloc(bloc))
    }
    return ret
  }

  createLines() {
    let ret = []
    for (let line of this.state.lines) {
      ret.push(
        <table className='line' cellSpacing="0" cellPadding="0">
          {this.createLine(line)}
        </table>
      )
    }
    return ret
  }

  afficherReponse(text) {
    console.log(text)
  }

  acidMode(event, state) {
    for (let line in state.lines) {
      for (let char in state.lines[line]) {
        state.lines[line][char]++;
        state.lines[line][char] = (state.lines[line][char] % 9)
      }
    }
    this.setState(state)
  }

  bjr(event) {
    const state = this.state
    console.log('AH')
    if (event.key === "z")
      this.acidMode(event, state)
    else if (event.key === '.')
      move('right', this.socket)
    else if (event.key === ',')
      move('left', this.socket)
    else if (event.key === ' ')
      move('down', this.socket)
  }

  refreshGame(game, context) {
    const state = context.state
    state.lines = game.lines
    state.tetri = game.tetri
    console.log('refreshed')
    context.setState(state)
  }


  componentDidMount() {
    // fonction pour set toutes les reponses serv
    // this.socket.on('reponse', (text) => {
    //   console.log(text)
    // });
    this.socket.on('refreshVue', (game) => { this.refreshGame(game, this) })
    this.socket.emit('start')
    window.addEventListener("keypress", this.bjr.bind(this))
  }

  render() {
    return (
      <div className='display'>
        <div className="board">
          {this.createLines()}
        </div>
        <div className="rightPanel">
          <div className="nextBloc">
            <p className="nextText">NEXT :</p>
            <div className="nextPiece"></div>
          </div>
          <p className="score">Score :<br />00</p>
        </div>
      </div>
    )
  }
}

export default App
