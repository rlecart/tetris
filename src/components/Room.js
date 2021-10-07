import React, { useState } from 'react';
import { connect } from "react-redux";

import api from '../api/clientApi';
import nav from "../misc/nav";
import { canIStayHere, isEmpty } from '../misc/utils.js';
import { setNewRoomInfo } from '../Store/Reducers/roomReducer';

const Room = (props) => {
  const [loaded, setLoaded] = useState(false);
  const socket = (props.socketConnector) ? props.socketConnector.socket : undefined;
  const roomInfo = (props.roomReducer) ? props.roomReducer.roomInfo : undefined;
  const roomUrl = (props.homeReducer && props.homeReducer.home) ? props.homeReducer.home.roomUrl : undefined;

  const createList = () => {
    let ret = [];

    if (roomInfo && roomInfo.listPlayers) {
      for (let player of Object.values(roomInfo.listPlayers)) {
        ret.push(<div className="player">{player._profil.name}</div>);
      }
    }
    return (ret);
  };

  const ifOwner = () => {
    if (roomInfo && roomInfo.owner && socket.id === roomInfo.owner)
      return (
        <button className="roomButton" id="leaveLaunch" onClick={() => { api.askToStartGame(socket, roomUrl); }}>
          <span className="textButton">Lancer la partie</span>
        </button>
      );
  };


  const pleaseUnmountRoom = (completly) => {
    if (!isEmpty(props.socketConnector) && !isEmpty(socket)) {
      socket.removeAllListeners();
      setLoaded(false);
    }
    if (completly)
      setNewRoomInfo(props.dispatch, undefined, 'delete');
    console.log('unmount room', roomInfo);
  };

  React.useEffect(() => {
    canIStayHere('room', props)
      .then(
        () => {
          if (!loaded) {
            socket.on('disconnect', () => {
              pleaseUnmountRoom('completly');
              nav(props.history, '/');
            });
            socket.on('goToGame', () => {
              pleaseUnmountRoom();
              nav(props.history, `${props.location.pathname}/game`);
            });
            socket.on('refreshRoomInfo', (newRoomInfo) => { setNewRoomInfo(props.dispatch, newRoomInfo); });
            setLoaded(true);
          }
          if (!roomInfo) {
            console.log('ca va getRoomInfo');
            api.getRoomInfo(socket, roomUrl).then((newRoomInfo) => { console.log('ca getroom'); setNewRoomInfo(props.dispatch, newRoomInfo); });
          }
        },
        () => { nav(props.history, '/'); });

    return (() => {
      console.log('real unmount room');
    });
  }, []);

  let players = createList();
  let startGame = ifOwner();

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
                api.leaveRoom(socket, roomUrl)
                  .then(() => {
                    pleaseUnmountRoom('completly');
                    props.history.replace('/');
                  });
              }}>
                <span className="textButton">Quitter</span>
              </button>
              {startGame}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Room);