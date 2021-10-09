import React from 'react';
import { connect } from 'react-redux';

import api, { joinRoom } from "../api/clientApi";
import nav from '../misc/nav';
import openSocket from 'socket.io-client';

const Home = ({
  dispatch,
  history,
  location,
  match,
  socketReducer,
  roomReducer,
  homeReducer,
  gameReducer,
}) => {
  const [whichButton, setWhichButton] = React.useState(undefined);

  const handleChange = (event) => {
    let newProfil = homeReducer.profil;
    let newJoinUrl = homeReducer.joinUrl;

    if (event.target.name === 'name')
      newProfil = { name: event.target.value };
    else if (event.target.name === 'roomUrl')
      newJoinUrl = event.target.value;
    setNewHomeInfo(newProfil, newJoinUrl, undefined);
  };

  const setNewHomeInfo = (newProfil, newJoinUrl, newOwner) => {
    let action = {
      type: 'SYNC_HOME_DATA',
      value: {
        profil: newProfil,
        joinUrl: newJoinUrl,
        owner: newOwner,
      },
    };
    dispatch(action);
  };

  React.useEffect(() => {
    let socket;

    if (!socketReducer.socket) {
      console.log('socket vide');
      socket = openSocket('http://localhost:8000');
      const action = { type: 'CONNECT_SOCKET', value: socket };
      dispatch(action);
    }
    return (() => console.log('real unmount home'));
  }, []);

  const submitForm = (event) => {
    console.log('submit');
    event.preventDefault();
    if (whichButton === 'joinRoom') {
      api.joinRoom(socketReducer.socket, homeReducer.profil, homeReducer.joinUrl)
        .then((url) => {
          setNewHomeInfo(homeReducer.profil, url, false);
          nav(history, `/#${url}[${homeReducer.profil.name}]`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else if (whichButton === 'createRoom') {
      console.log(homeReducer.profil);
      api.createRoom(socketReducer.socket, homeReducer.profil)
        .then((url) => {
          setNewHomeInfo(homeReducer.profil, url, true);
          nav(history, `/#${url}[${homeReducer.profil.name}]`);
        });
    }
    setWhichButton(undefined);
  };

  return (
    <div className="display">
      <div className="homeMenu">
        <div className="topPanel">
          <span className="title">Super Tetris 3000</span>
        </div>
        <div className="bottomPanel">
          <form onSubmit={(event) => submitForm(event)}>
            <div className="blocMenu" id="home">
              <div className="avatarSelector">
                <div className="avatarButton" />
                <div className="avatar" />
                <div className="avatarButton" />
              </div>
              <input className='nickname' type="text" name="name" pattern='[A-Za-z-]{1,}' required value={homeReducer.profil.name}
                onChange={(event) => handleChange(event)} />
            </div>
            <div className="blocMenu" id="home">
              <input className='roomUrl' type="text" name="roomUrl" required={whichButton === 'joinRoom'} value={homeReducer.joinUrl}
                onChange={(event) => handleChange(event)} placeholder='URL' />
              <button type="submit" className="roomButton" onClick={() => setWhichButton('joinRoom')}>
                <span className="textButton">Join room</span>
              </button>
              <button type="submit" className="roomButton" onClick={() => setWhichButton('createRoom')}>
                <span className="textButton">Create Room</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div >
  );
};

const mapStateToProps = (state) => {
  return (state);
};

export default connect(mapStateToProps)(Home);