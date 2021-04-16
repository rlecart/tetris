import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { getPlayerList } from '../api/clientApi'

class Room extends Component {
  state = {
    playersList: {},
    rules: {},
  }

  createList() {
    for (let player in this.state.playersList)
      <div className="player" />
  }

  componentDidMount() {
    let state = this.state
    // state.playersList = getPlayerList(socket, idRoom)
    this.setState(state)
  }

  render() {
    return (
      <div className="v13_2">
        <div className="v13_4">
          <div className="v14_4">
            <div className="playerList">
              {this.createList()}
              <div className="v14_5"></div>
              <div className="v14_10"></div>
              <div className="v14_6"></div>
              <div className="v14_11"></div>
              <Link to='/game'>
                <button className="v14_14"></button>
              </Link>
              <div className="v14_7"></div>
              <div className="v14_12"></div>
              <div className="v14_8"></div>
              <div className="v14_13"></div>
            </div>
          </div>
          <div className="name"></div>
          <div className="v14_3"></div>
        </div>
        <div className="v14_17"><span className="v14_18">Super Tetris 3000</span></div>
      </div>
    )
  }
}

export default Room