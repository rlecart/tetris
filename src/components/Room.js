import React, { Component } from 'react';
import { connect } from "react-redux";

import api from '../api/clientApi';
import nav from "../misc/nav";
import { canIStayHere, isEmpty } from '../misc/utils.js';

class Room extends Component {
  state = {
    profil: {
      name: '',
      owner: false,
    },
    roomUrl: '',
    roomInfo: undefined,
    history: this.props.history,
  };

  createList() {
    let ret = [];

    if (this.state.roomInfo && this.state.roomInfo.listPlayers) {
      for (let value of Object.values(this.state.roomInfo.listPlayers)) {
        ret.push(<div className="player">{value._profil.name}</div>);
      }
    }
    return (ret);
  }

  syncRoomData(roomInfo) {
    let state = this.state;
    let action = {
      type: 'SYNC_ROOM_DATA',
      value: roomInfo,
    };
    let id = this.props.socketConnector.socket.id;

    if (!roomInfo || isEmpty(roomInfo))
      return (-1);
    state.roomInfo = roomInfo;
    state.profil.owner = roomInfo.listPlayers[id]._profil.owner;
    this.setState(state);
    this.props.dispatch(action);
  }

  componentDidMount() {
    canIStayHere('room', this)
      .then(
        () => {
          let state = this.state;
          let url = this.props.match.url;
          state.profil.name = url.substring(url.search(/\[[0-9a-zA-Z]+\]/) + 1, url.length - 1);
          state.roomUrl = url.substring(1, url.search(/\[/));
          this.props.socketConnector.socket.on('disconnect', () => nav(this.props.history, '/'));
          this.props.socketConnector.socket.on('goToGame', () => { nav(this.props.history, `${this.props.location.pathname}/game`); });
          this.props.socketConnector.socket.on('refreshRoomInfo', (roomInfo) => { this.syncRoomData(roomInfo); });
          if (!state.roomInfo)
            api.getRoomInfo(this.props.socketConnector.socket, state.roomUrl).then((roomInfo) => this.syncRoomData(roomInfo));
          else
            state.roomInfo = this.props.roomReducer.roomInfo;
          this.setState(state);
        },
        () => {
          nav(this.props.history, '/');
        });
  }

  componentWillUnmount() {
    if (Object.keys(this.props.socketConnector).length !== 0 && Object.keys(this.props.socketConnector.socket).length !== 0)
      this.props.socketConnector.socket.removeAllListeners();
  }

  isOwner() {
    if (this.state.profil.owner)
      return (
        <button className="roomButton" id="leaveLaunch" onClick={() => { api.askToStartGame(this.props.socketConnector.socket, this.state.roomUrl); }}>
          <span className="textButton">Lancer la partie</span>
        </button>
      );
  }

  render() {
    let players = this.createList();
    let startGame = this.isOwner();

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
                <button className="roomButton" id="leaveLaunch" onClick={() => {
                  api.leaveRoom(this.props.socketConnector.socket, this.state.roomUrl)
                    .then(() => this.state.history.replace('/'));
                }}>
                  <span className="textButton">Quitter</span>
                </button>
                {startGame}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Room);