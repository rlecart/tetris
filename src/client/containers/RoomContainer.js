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
      for (let [key, player] of Object.entries(roomReducer.listPlayers)) {
        ret.push(<div className="player" key={key}>{player._profil.name}</div>);
      }
    }
    return (ret);
  };

  const ifOwner = () => {
    if (roomReducer && roomReducer.owner && socketReducer.socket.id === roomReducer.owner)
      return (
        <button className="roomButton" id="launch" onClick={() => { api.askToStartGame(socketReducer.socket, roomReducer.url); }}>
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
    // console.log('unmount room', roomReducer);
  };

  React.useEffect(() => {
    canIStayHere('room', { roomReducer, homeReducer, socketReducer })
      .then(
        () => {
          console.log('mount room');
          if (!loaded.current) {
            socketReducer.socket.on('disconnect', () => {
              // console.log(socketReducer, roomReducer, homeReducer)
              pleaseUnmountRoom('completly');
              console.log('ca disconnect');
              history.push('/');
            });
            socketReducer.socket.on('goToGame', () => {
              pleaseUnmountRoom();
              console.log('ca go to game');
              history.push(`${location.pathname}/game`);
            });
            socketReducer.socket.on('refreshRoomInfo', (newRoomInfo) => {
              console.log(roomReducer)
              console.log('ca refresh car new info room', newRoomInfo)
              setNewRoomInfo(dispatch, newRoomInfo)});
            api.getRoomInfo(socketReducer.socket, homeReducer.joinUrl)
              .then((newRoomInfo) => {
                console.log('\nca get')
                console.log('ca get')
                console.log('ca get')
                console.log('ca get')
                console.log('ca get')
                console.log(newRoomInfo, roomReducer, '\n')
                setNewRoomInfo(dispatch, newRoomInfo);
                // console.log('ca get 1 fois', newRoomInfo);
                // console.log('ca get 1 fois', roomReducer);
              })
              .catch((err) => {
                pleaseUnmountRoom('completly');
                console.log('ca arrive pas a getRoom');
                history.push('/');
              });
            loaded.current = true;
          }
        })
      .catch(() => {
        console.log('ca cantstayhere');
        history.push('/');
      });

    return (() => {
      console.log('real unmount room');
    });
  }, []);

  const leaveRoom = () => {

    // console.log('roomReducer = ', roomReducer);
    api.leaveRoom(socketReducer.socket, roomReducer.url)
      .then(() => {
        console.log('ca leaveRoom');
        pleaseUnmountRoom('completly');
        history.replace('/');
      })
      .catch(() => {
        console.log('ca leave pas Room');
      });
  };

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
            leaveRoom={leaveRoom}
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