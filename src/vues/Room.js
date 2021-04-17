import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { getPlayerList } from '../api/clientApi'

class Room extends Component {
  state = {
    profil: {
      name: '',
    },
    roomUrl: '',
    playersList: [],
    rules: {},
  }

  createList() {
    for (let player in this.state.playersList)
      <div className="player" />
  }

  componentDidMount() {
    let state = this.state
    let url = this.props.match.url
    state.profil.name = url.substring(url.search(/\[[0-9a-zA-Z]+\]/) + 1, url.length - 1)
    state.roomUrl = url.substring(1, url.search(/\[/))
      console.log(this.props)
    // state.playersList = getPlayerList(this.props.socket, state.roomUrl, () => { this.setState(state) })
  }

  render() {
    console.log(this.props)
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