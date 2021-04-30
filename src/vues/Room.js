import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { getRoomInfo, startGame } from '../api/clientApi'
import { connect } from "react-redux";
import nav from "../misc/nav";


class Room extends Component {
  state = {
    profil: {
      name: '',
    },
    roomUrl: '',
    roomInfo: undefined,
  }

  createList() {
    let ret = []

    console.log('createlist', this.state)
    if (this.state.roomInfo && this.state.roomInfo.listPlayers) {
      for (let player of this.state.roomInfo.listPlayers) {
        ret.push(<div className="player">{player.name}</div>)
      }
    }
    return ret
  }

  syncRoomData(roomInfo) {
    let state = this.state
    let action = {
      type: 'SYNC_ROOM_DATA',
      value: roomInfo,
    }
    console.log('sync', this.props)
    console.log(roomInfo)
    state.roomInfo = roomInfo
    this.setState(state)
    this.props.dispatch(action)
  }

  componentDidMount() {

    this.props.socketConnector.socket.on('goToGame', () => { nav(this.props.history, `${this.props.location.pathname}/game`) })
    this.props.socketConnector.socket.on('refreshRoomInfo', (roomInfo) => { this.syncRoomData(roomInfo) })
    let state = this.state
    let url = this.props.match.url
    state.profil.name = url.substring(url.search(/\[[0-9a-zA-Z]+\]/) + 1, url.length - 1)
    state.roomUrl = url.substring(1, url.search(/\[/))
    console.log('mount', state.roomInfo)
    console.log('propsmount', this.props)
    if (!state.roomInfo) {
      console.log('init')
      getRoomInfo(this.props.socketConnector.socket, state.roomUrl, this.syncRoomData.bind(this))
    }
    else {
      console.log('hahah')
      state.roomInfo = this.props.roomReducer.roomInfo
    }
    this.setState(state)
  }

  render() {
    let players = this.createList()
    console.log('players', players)
    return (
      <div className="v13_2">
        <div className="v13_4">
          <div className="v14_4">
            <div className="playerList">
              {players}
              <button className="v14_14" onClick={() => { startGame(this.props.socketConnector.socket, this.state.profil, this.state.roomUrl, (path) => { nav(this.props.history, path) }) }}>
              </button>
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

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(Room)