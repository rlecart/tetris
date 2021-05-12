import React, { Component } from 'react'
import openSocket from 'socket.io-client'
import { connect } from "react-redux";

import colors from '../ressources/colors.js'
import { move } from '../api/clientApi.js'
import nav from "../misc/nav";

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
    ],
    spec: [],
  }

  createbloc(bloc, blocClass, id, idTetri) {
    let col = (idTetri && bloc !== 0) ? idTetri : bloc
    return <div className={blocClass} id={id} style={{ backgroundColor: colors[col] }} />
  }

  createLine(line, blocClass, id, idTetri) {
    let ret = []
    for (let bloc of line) {
      ret.push(this.createbloc(bloc, blocClass, id, idTetri))
    }
    return ret
  }

  createLines(lines, lineClass, blocClass, id, idTetri) {
    let ret = []

    if (idTetri === 5)
      lines.unshift(new Array(lines[0].length).fill(0))
    for (let line of lines) {
      ret.push(
        <div className={lineClass}>
          {this.createLine(line, blocClass, id, idTetri)}
        </div>
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
    const socket = this.socket
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

  refreshGame(game, spec, context) {
    // console.log(game)
    const state = context.state
    state.lines = game.lines
    state.tetri = game.tetri
    state.interval = game.interval
    console.log('\n\n', spec, '\n\n')
    state.spec = spec
    // state.client = game.client
    console.log('refreshed')
    // console.log(game.tetri.id)
    context.setState(state)
  }

  componentDidMount() {
    // console.log('bonjoru', this.props)
    // fonction pour set toutes les reponses serv
    this.socket.on('refreshVue', (game, spec) => { this.refreshGame(game, spec, this) })
    this.socket.on('endGame', (roomInfo) => { nav(this.props.history, `/${this.props.match.params.room}`) })
    if (this.props.socketConnector.areGameEventsLoaded === false) {
      window.addEventListener("keypress", this.bjr.bind(this))
      const action = { type: 'GAME_EVENTS_LOADED' }
      this.props.dispatch(action)
    }
    this.socket.emit('readyToStart', this.socket.id, this.props.roomReducer.roomInfo.url)
  }

  componentWillUnmount() {
    this.socket.removeAllListeners()
  }

  createSpec(players) {
    let ret = []

    for (let player of players) {
      ret.push(
        <div className='blocSpec'>
          <div className="board" id='spec'>
            {this.createLines(player.lines, 'line', 'lineBloc', 'spec')}
          </div>
          <div className="nicknameSpec">{player.name}</div>
        </div>
      )
    }
    return ret
  }

  render() {
    console.log(this.state)
      let spec = (this.state.spec.length !== 0) ? [
        this.state.spec.slice(0, this.state.spec.length / 2),
        this.state.spec.slice(this.state.spec.length / 2)
      ] : undefined
    return (
      <div className='display'>
        <div className="game" id="spec">
          <div className="spec">
            {spec ? this.createSpec(spec[0]) : undefined}
          </div>
        </div>
        <div className="game">
          <div className="board">

            {this.createLines(this.state.lines, 'line', 'lineBloc')}
          </div>
          <div className="rightPanel">
            <div className="nextText">NEXT :</div>
            <div className="nextPiece">
              {this.state.tetri !== undefined ? this.createLines(this.state.tetri.nextShape, 'lineNext', 'lineBlocNext', undefined, this.state.tetri.nextId) : undefined}
            </div>
            <div className="score">Score :<br />00</div>
          </div>
        </div>
        <div className="game" id="spec">
          <div className="spec">
            {spec ? this.createSpec(spec[1]) : undefined}
          </div>
        </div>
      </div>

    )
  }
}


const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(Game)