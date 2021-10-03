import React from 'react';
import { connect } from "react-redux";

import api from '../api/clientApi';
import nav from "../misc/nav";
import { canIStayHere, isEmpty } from '../misc/utils.js';


const Room = (props) => {
  const [profil, setProfil] = React.useState({
    name: '',
    owner: false,
  });
  const [roomUrl, setRoomUrl] = React.useState('');
  const [roomInfo, setRoomInfo] = React.useState(undefined);
  // state = {
    //   profil: {
      //     name: '',  
      //     owner: false,
      //   },
      //   roomUrl: '',
      //   roomInfo: undefined,
      //   history: props.history,
      // };
      
      const createList = () => {
        let ret = [];
        
        if (roomInfo && roomInfo.listPlayers) {
          for (let player of Object.values(roomInfo.listPlayers)) {
            ret.push(<div className="player">{player._profil.name}</div>);
          }
        }
        return (ret);
      };
      
      const isOwner = () => {
        if (roomInfo && roomInfo.owner && props.socketConnector.socket.id === roomInfo.owner)
        return (
          <button className="roomButton" id="leaveLaunch" onClick={() => { api.askToStartGame(props.socketConnector.socket, roomUrl); }}>
          <span className="textButton">Lancer la partie</span>
        </button>
      );
    };

    const syncRoomData = (newRoomInfo) => {
      let newProfil = profil;
      let action = {
        type: 'SYNC_ROOM_DATA',
        value: newRoomInfo,
      };
    
      if (!newRoomInfo || isEmpty(newRoomInfo))
        return (-1);
      // if (newRoomInfo.listPlayers[id]) {
      //   newRoomInfo.listPlayers[id]._profil.owner = (id === newProfil.owner) ? true : false;
      // }
      // if (newRoomInfo.listPlayers[id])
      //   newProfil.owner = newRoomInfo.listPlayers[newRoomInfo.owner]._profil.owner;
      console.log(newRoomInfo);
      setRoomInfo(newRoomInfo);
      setProfil(newProfil);
      props.dispatch(action);
    };

  const pleaseUnmountRoom = () => {
    if (!isEmpty(props.socketConnector) && !isEmpty(props.socketConnector.socket))
      props.socketConnector.socket.removeAllListeners();
    console.log('unmount room');
  };

  React.useEffect(() => {
    canIStayHere('room', props)
      .then(
        () => {
          let url = props.match.url;
          let newProfil = {
            ...profil,
            name: url.substring(url.search(/\[[0-9a-zA-Z]+\]/) + 1, url.length - 1),
          };
          let newRoomUrl = url.substring(1, url.search(/\[/));
          let newRoomInfo = roomInfo;
          props.socketConnector.socket.on('disconnect', () => {
            pleaseUnmountRoom();
            nav(props.history, '/');
          });
          props.socketConnector.socket.on('goToGame', () => {
            pleaseUnmountRoom();
            nav(props.history, `${props.location.pathname}/game`);
          });
          props.socketConnector.socket.on('refreshRoomInfo', (newRoomInfo) => { syncRoomData(newRoomInfo); });
          if (!roomInfo)
            api.getRoomInfo(props.socketConnector.socket, newRoomUrl).then((newRoomInfo) => syncRoomData(newRoomInfo));
          else
            newRoomInfo = props.roomReducer.roomInfo;
          setProfil(newProfil);
          setRoomUrl(newRoomUrl);
          setRoomInfo(newRoomInfo);
        },
        () => {
          nav(props.history, '/');
        });

    return (() => {
      console.log('real unmount');
    });
  }, []);

  let players = createList();
  let startGame = isOwner();

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
                api.leaveRoom(props.socketConnector.socket, roomUrl)
                  .then(() => {
                    pleaseUnmountRoom();
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