import React from 'react';
import { connect } from 'react-redux';

import api from "../api/clientApi";
import nav from '../misc/nav';

const handleChange = (props, event, [profil, setProfil], [roomUrl, setRoomUrl]) => {
  let newProfil = profil;
  let newRoomUrl = roomUrl;

  if (event.target.name === 'name')
    newProfil = { name: event.target.value };
  else if (event.target.name === 'roomUrl')
    newRoomUrl = event.target.value;
  let action = {
    type: 'SYNC_HOME_DATA',
    value: {
      profil: newProfil,
      roomUrl: newRoomUrl,
    },
  };
  props.dispatch(action);
  setProfil(newProfil);
  setRoomUrl(newRoomUrl);
};

const Home = (props) => {
  const [profil, setProfil] = React.useState({ name: '' });
  const [roomUrl, setRoomUrl] = React.useState('');

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
            <input className='nickname' type="text" name="name" required onChange={
              (event) => handleChange(props, event, [profil, setProfil], [roomUrl, setRoomUrl])
            } />
          </div>
          <div className="blocMenu" id="home">
            <input className='roomUrl' type="text" name="roomUrl" required onChange={
              (event) => handleChange(props, event, [profil, setProfil], [roomUrl, setRoomUrl])
            } placeHolder='URL' />
            <button className="roomButton" onClick={() => {
              api.joinRoom(props.socketConnector.socket, profil, roomUrl)
                .then((url) => { nav(props.history, `/#${url}[${profil.name}]`); });
            }}>
              <span className="textButton">Join room</span>
            </button>
            <button className="roomButton" onClick={() => {
              api.createRoom(props.socketConnector.socket, profil)
                .then((url) => { nav(props.history, `/#${url}[${profil.name}]`); });
            }}>
              <span className="textButton">Create Room</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return (state);
};

export default connect(mapStateToProps)(Home);