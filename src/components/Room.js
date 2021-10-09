import React, { useRef } from 'react';
import { connect } from "react-redux";

import api from '../api/clientApi';
import nav from "../misc/nav";
import { canIStayHere, isEmpty } from '../misc/utils.js';
import { setNewRoomInfo } from '../Store/Reducers/roomReducer';

const Room = ({
  dispatch,
  history,
  location,
  match,
  socketReducer,
  roomReducer,
  homeReducer,
  gameReducer,
}) => {
  const loaded = useRef(false);

  // React.useEffect(() => {
  // }, []);

  const createList = () => {
    let ret = [];

    if (roomReducer && roomReducer.listPlayers) {
      for (let player of Object.values(roomReducer.listPlayers)) {
        ret.push(<div className="player">{player._profil.name}</div>);
      }
    }
    return (ret);
  };

  const ifOwner = () => {
    if (roomReducer && roomReducer.owner && socketReducer.socket.id === roomReducer.owner)
      return (
        <button className="roomButton" id="leaveLaunch" onClick={() => { api.askToStartGame(socketReducer.socket, roomReducer.url); }}>
          <span className="textButton">Lancer la partie</span>
        </button>
      );
  };

  const pleaseUnmountRoom = (completly) => {
    if (!isEmpty(socketReducer) && !isEmpty(socketReducer.socket)) {
      socketReducer.socket.removeAllListeners();
    }
    if (completly)
      dispatch({ type: 'DELETE_ROOM_DATA' });
    loaded.current = false;
    console.log('unmount room', roomReducer);
  };

  React.useEffect(() => {
    canIStayHere('room', { roomReducer, homeReducer, socketReducer })
      .then(
        () => {
          console.log('mount room');
          if (!loaded.current) {
            socketReducer.socket.on('disconnect', () => {
              pleaseUnmountRoom('completly');
              nav(history, '/');
            });
            socketReducer.socket.on('goToGame', () => {
              pleaseUnmountRoom();
              nav(history, `${location.pathname}/game`);
            });
            socketReducer.socket.on('refreshRoomInfo', (newRoomInfo) => { setNewRoomInfo(dispatch, newRoomInfo); });
            console.log('ca va getRoomInfo');
            api.getRoomInfo(socketReducer.socket, homeReducer.joinUrl).then((newRoomInfo) => { console.log('ca getroom'); setNewRoomInfo(dispatch, newRoomInfo); });
            loaded.current = true;
          }
        },
        () => { nav(history, '/'); });

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
                api.leaveRoom(socketReducer.socket, roomReducer.url)
                  .then(() => {
                    pleaseUnmountRoom('completly');
                    history.replace('/');
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