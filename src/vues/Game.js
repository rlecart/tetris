import React, { Component } from 'react'
import openSocket from 'socket.io-client'
import { connect } from "react-redux";

import colors from '../ressources/colors.js'
import { move } from '../api/clientApi.js'
import { redirectTo } from "../api/serverApi";

class Game extends Component {
  socket = this.props.socketConnector.socket
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
    const socket = this.props.socketConnector.socket
    const url = this.props.roomReducer.roomInfo.url

    console.log(url)

    console.log('AH')
    if (event.key === "z")
      this.acidMode(event, state)
    else if (event.key === '.')
      move('right', url, socket)
    else if (event.key === ',')
      move('left', url, socket)
    else if (event.key === ' ')
      move('down', url, socket)
    else if (event.key === '/')
      move('turn', url, socket)
    else if (event.key === 'c')
      socket.emit('endGame')
  }

  refreshGame(game, context) {
    console.log(game)
    const state = context.state
    state.lines = game.lines
    state.tetri = game.tetri
    state.interval = game.interval
    // state.client = game.client
    console.log('refreshed')
    // console.log(game.tetri.id)
    context.setState(state)
  }

  componentDidMount() {
    // console.log('bonjoru', this.props)
    // fonction pour set toutes les reponses serv
    // this.socket.on('reponse', (text) => {
    //   console.log(text)
    // });
    this.socket.on('refreshVue', (game) => { this.refreshGame(game, this) })
    this.socket.on('endGame', () => { redirectTo('/') })
    this.socket.emit('readyToStart', this.socket.id, this.props.roomReducer.roomInfo.url)
    window.addEventListener("keypress", this.bjr.bind(this))
  }

  render() {
    return (
      <div className='display'>
        <div className="commands">

          <p>Controles :
  <br />
            {'< = left'}
            <br />
            {'> = right'}
            <br />
            {'space = down'}
            <br />
            {'/ = turn'}
          </p>
        </div>
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


const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(Game)