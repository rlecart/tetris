import logo from './logo.svg';
import './App.css';

import React, { Component, Fragment } from 'react'

import colors from './ressources/colors.js'

class App extends Component {
  state = {
    lines: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  }

  createbloc(bloc) {
    return <div className='lineBloc' style={{backgroundColor: colors[bloc]}} />
  }

  createLine(line) {
    let ret = []
    for (let bloc in line) {
      ret.push(this.createbloc(bloc))
    }
    return ret
  }

  createLines() {
    let ret = []
    for (let line in this.state.lines) {
      ret.push(<div className='line'>
        {this.createLine(line)}
      </div>)
    }
    return ret
  }

  render() {
    return (
      <div className='display'>
        <div className="board">
          {this.createLines()}
          {/* <div className="line">
            <div className="lineBloc">
            </div>
          </div> */}
        </div>
        <div className="rightPanel">
          <div className="nextBloc">
            <p className="nextText">NEXT :</p>
            <div className="nextPiece"></div>
          </div>
          <p className="score">Score :<br />10</p>
        </div>
      </div>
    )
  }
}

export default App
