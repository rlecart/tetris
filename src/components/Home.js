import React from 'react';
import { connect } from 'react-redux';

import api from "../api/clientApi";
import nav from '../misc/nav';
import { isEmpty } from '../misc/utils';

const Home = (props) => {
  const socket = props.socketConnector.socket;
  const profil = (props.homeReducer && props.homeReducer.home && props.homeReducer.home.profil) ? props.homeReducer.home.profil : undefined;
  const roomUrl = (props.homeReducer && props.homeReducer.home && props.homeReducer.home.roomUrl) ? props.homeReducer.home.roomUrl : undefined;

  const handleChange = (event) => {
    let newProfil;
    let newRoomUrl;

    if (event.target.name === 'name')
      newProfil = { name: event.target.value };
    else if (event.target.name === 'roomUrl')
      newRoomUrl = event.target.value;
    setNewHomeInfo(newProfil, newRoomUrl, undefined);
  };

  const setNewHomeInfo = (newProfil, newRoomUrl, newOwner) => {
    let action = {
      type: 'SYNC_HOME_DATA',
      value: {
        profil: newProfil,
        roomUrl: newRoomUrl,
        owner: newOwner,
      },
    };
    props.dispatch(action);
  };

  React.useEffect(() => {
    console.log(socket);
    if (socket && !isEmpty(socket))
      socket.removeAllListeners();
    return (() => console.log('real unmount home'));
  }, []);

  return (
    <div className="display">
      <div className="homeMenu">
        <div className="topPanel">
          <span className="title">Super Tetris 3000</span>
        </div>
        <div className="bottomPanel">
          <div className="blocMenu" id="home">
            <div className="avatarSelector">
              <div className="avatarButton" />
              <div className="avatar" />
              <div className="avatarButton" />
            </div>
            <input className='nickname' type="text" name="name" required
              onChange={(event) => handleChange(event)} />
          </div>
          <div className="blocMenu" id="home">
            <input className='roomUrl' type="text" name="roomUrl" required
              onChange={(event) => handleChange(event)} placeholder='URL' />
            <button className="roomButton" onClick={() => {
              api.joinRoom(socket, profil, roomUrl)
                .then((url) => {
                  setNewHomeInfo(profil, url, false);
                  nav(props.history, `/#${url}[${profil.name}]`);
                });
            }}>
              <span className="textButton">Join room</span>
            </button>
            <button className="roomButton" onClick={() => {
              console.log(profil);
              api.createRoom(socket, profil)
                .then((url) => {
                  console.log('coucou ca nav');
                  setNewHomeInfo(profil, url, true);
                  nav(props.history, `/#${url}[${profil.name}]`);
                });
            }}>
              <span className="textButton">Create Room</span>
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

const mapStateToProps = (state) => {
  return (state);
};

export default connect(mapStateToProps)(Home);