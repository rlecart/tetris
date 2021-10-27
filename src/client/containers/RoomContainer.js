import React, { useRef } from 'react';
import { connect } from "react-redux";

import api from '../api/clientApi';
import { canIStayHere, isEmpty } from '../../misc/utils.js';
import { setNewRoomInfo, deleteRoomData } from '../actions/roomAction';
import TopPanel from '../components/TopPanel';
import BottomPanel from '../components/BottomPanel';
import RulesPanel from '../components/RulesPanel';
import PlayersPanel from '../components/PlayersPanel';
import Display from '../components/Display';

const RoomContainer = ({
  dispatch,
  history,
  location,
  socketReducer,
  roomReducer,
  homeReducer,
}) => {
  const loaded = useRef(false);

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
      deleteRoomData(dispatch);
    loaded.current = false;
    console.log('unmount room', roomReducer);
  };

  React.useEffect(() => {
    canIStayHere('room', { roomReducer, homeReducer, socketReducer })
      .then(
        () => {
          console.log('mount room', roomReducer);
          if (!loaded.current) {
            socketReducer.socket.on('disconnect', () => {
              pleaseUnmountRoom('completly');
              history.push('/');
            });
            socketReducer.socket.on('goToGame', () => {
              pleaseUnmountRoom();
              history.push(`${location.pathname}/game`);
            });
            socketReducer.socket.on('refreshRoomInfo', (newRoomInfo) => { setNewRoomInfo(dispatch, newRoomInfo); });
            api.getRoomInfo(socketReducer.socket, homeReducer.joinUrl).then((newRoomInfo) => { setNewRoomInfo(dispatch, newRoomInfo); });
            loaded.current = true;
          }
        },
        () => { history.push('/'); });

    return (() => {
      console.log('real unmount room');
    });
  }, []);

  let players = createList();
  let startGameButton = ifOwner();

  return (
    <Display>
      <div className="homeMenu" id="inRoom">
        <TopPanel />
        <BottomPanel id='inRoom'>
          <RulesPanel />
          <PlayersPanel
            players={players}
            startGameButton={startGameButton}
            leaveRoom={() => {
              api.leaveRoom(socketReducer.socket, roomReducer.url)
                .then(() => {
                  pleaseUnmountRoom('completly');
                  history.replace('/');
                });
            }}
          />
        </BottomPanel>
      </div>
    </Display>
  );
};

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(RoomContainer);