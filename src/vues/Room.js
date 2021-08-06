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
    let state = this.state
    let url = this.props.match.url
    state.profil.name = url.substring(url.search(/\[[0-9a-zA-Z]+\]/) + 1, url.length - 1)
    state.roomUrl = url.substring(1, url.search(/\[/))
    this.props.socketConnector.socket.on('goToGame', () => { nav(this.props.history, `${this.props.location.pathname}/game`) }) // utile avec la cb en bas ? ca fait 2 fois la meme
    this.props.socketConnector.socket.on('refreshRoomInfo', (roomInfo) => { this.syncRoomData(roomInfo) })
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

  componentWillUnmount() {
    this.props.socketConnector.socket.removeAllListeners()
  }

  render() {
    let players = this.createList()
    console.log('players', players)
    return (
      <div className="display">
        <div className="homeMenu" id="inRoom">
          <div className="topPanel">
            <span className="title">Super Tetris 3000</span>
          </div>
          <div className="bottomPanel" id="inRoom">
            <div className="blocMenu" id="rules">
            </div>
            <div className="blocMenu" id="listPlayers">
              <div className="playerList">
                {players}
              </div>
              <button className="roomButton" id="launchGame" onClick={() => { startGame(this.props.socketConnector.socket, this.state.profil, this.state.roomUrl, (path) => { nav(this.props.history, path) }) }}>
                <span className="textButton">Lancer la partie</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(Room)