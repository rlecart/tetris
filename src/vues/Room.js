import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import api from '../api/clientApi'
import { connect } from "react-redux";
import nav from "../misc/nav";


class Room extends Component {
  state = {
    profil: {
      name: '',
      owner: false,
    },
    roomUrl: '',
    roomInfo: undefined,
    history: this.props.history,
  }

  createList() {
    let ret = []

    if (this.state.roomInfo && this.state.roomInfo.listPlayers) {
      for (let [key, value] of Object.entries(this.state.roomInfo.listPlayers)) {
        ret.push(<div className="player">{value._profil.name}</div>)
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
    let id = this.props.socketConnector.socket.id

    console.log('sync', this.props)
    console.log(roomInfo)
    state.roomInfo = roomInfo
    state.profil.owner = roomInfo.listPlayers[id]._profil.owner
    console.log('awoqigjqew')
    console.log(this.state)
    this.setState(state)
    this.props.dispatch(action)
  }

  componentDidMount() {
    let state = this.state
    let url = this.props.match.url
    state.profil.name = url.substring(url.search(/\[[0-9a-zA-Z]+\]/) + 1, url.length - 1)
    state.roomUrl = url.substring(1, url.search(/\[/))
    this.props.socketConnector.socket.on('goToGame', () => { nav(this.props.history, `${this.props.location.pathname}/game`) })
    this.props.socketConnector.socket.on('refreshRoomInfo', (roomInfo) => { this.syncRoomData(roomInfo) })
    console.log('mount', state.roomInfo)
    console.log('propsmount', this.props)
    if (!state.roomInfo) {
      console.log('init')
      api.getRoomInfo(this.props.socketConnector.socket, state.roomUrl, this.syncRoomData.bind(this))
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

  isOwner() {
    if (this.state.profil.owner)
      return (
        <button className="roomButton" id="leaveLaunch" onClick={() => { api.askToStartGame(this.props.socketConnector.socket, this.state.profil, this.state.roomUrl, undefined) }}>
          <span className="textButton">Lancer la partie</span>
        </button>
      )
  }

  leaveRoom() {
    api.leaveRoom(this.props.socketConnector.socket, this.state.profil, this.state.roomUrl)
    // this.state.history.goBack() // ici bah ca back bien mais j'ai l'impression que ca ecrase le socket avec un nouveau lors du componentDidMount() et y'en aura 2 qui se succederont quoi
    // this.state.history.goBack().bind(this)
    this.state.history.replace('/')
    // this.state.history.push('/')
  }

  render() {
    let players = this.createList()
    let startGame = this.isOwner()
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
              <div className="bottomButtons">
                <button className="roomButton" id="leaveLaunch" onClick={() => { this.leaveRoom() }}>
                  <span className="textButton">Quitter</span>
                </button>
                {startGame}
              </div>
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