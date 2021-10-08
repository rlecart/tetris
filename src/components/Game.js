import React, { Fragment, useState } from 'react';
import { connect } from "react-redux";

import colors from '../ressources/colors.js';
import api from '../api/clientApi.js';
import { canIStayHere, isEmpty } from '../misc/utils.js';
import nav from "../misc/nav";
import { setNewRoomInfo } from '../Store/Reducers/roomReducer.js';

const Game = ({
  dispatch,
  history,
  location,
  match,
  socketReducer,
  roomReducer,
  homeReducer,
  gameReducer,
}) => {
  const [loaded, setLoaded] = useState(false);
  let [isOut, setIsOut] = React.useState(false);
  let [showGoBack, setShowGoBack] = React.useState(false);

  // let tetri = (gameReducer) ? gameReducer._tetri : defaultGame.tetri;
  // let displayLines = (gameReducer) ? gameReducer.lines : defaultGame.lines;
  // React.useEffect(() => {
  //   console.log('re set var');
  // }, []);

  const createbloc = (bloc, blocClass, id, idTetri) => {
    let col = (idTetri && bloc !== 0) ? idTetri : bloc;

    return (<div className={blocClass} id={id} style={{ backgroundColor: colors[col] }} />);
  };

  const createLine = (line, blocClass, id, idTetri) => {
    let ret = [];

    for (let bloc of line)
      ret.push(createbloc(bloc, blocClass, id, idTetri));
    return (ret);
  };

  const createLines = (lines, lineClass, blocClass, id, idTetri) => {
    let ret = [];

    if (idTetri === 5 && lines.length < 3)
      lines.unshift(new Array(lines[0].length).fill(0));
    for (let line of lines) {
      ret.push(
        <div className={lineClass}>
          {createLine(line, blocClass, id, idTetri)}
        </div>
      );
    }
    return (ret);
  };

  const setNewGameInfo = (newGameInfo) => {
    console.log('newGameInfo = ', newGameInfo);
    let action = {
      type: 'SYNC_GAME_DATA',
      value: {
        lines: newGameInfo._lines,
        tetri: newGameInfo._tetri,
        isWaiting: newGameInfo._isWaiting,
        placed: newGameInfo._placed,
        // spec: newGameInfo._spec,
      },
    };

    console.log('newGameInfo = ', newGameInfo);
    dispatch(action);
  };

  const acidMode = () => {
    let newDisplayLines = gameReducer.lines;

    for (let line in newDisplayLines) {
      for (let char in newDisplayLines[line]) {
        newDisplayLines[line][char]++;
        newDisplayLines[line][char] = (newDisplayLines[line][char] % 9);
      }
    }
    setNewGameInfo({ ...gameReducer, lines: newDisplayLines });
  };

  const eventDispatcher = (event) => {
    console.log(event.key);
    if (event.key === "z")
      acidMode();
    else if (event.key === 'ArrowRight')
      api.move('right', roomReducer.url, socketReducer.socket);
    else if (event.key === 'ArrowLeft')
      api.move('left', roomReducer.url, socketReducer.socket);
    else if (event.key === ' ')
      api.move('down', roomReducer.url, socketReducer.socket);
    else if (event.key === 'ArrowUp')
      api.move('turn', roomReducer.url, socketReducer.socket);
    else if (event.key === 'ArrowDown')
      api.move('stash', roomReducer.url, socketReducer.socket);
    else if (event.key === 'c') {
      api.askToEndGame(socketReducer.socket, roomReducer.url);
    }
  };

  React.useEffect(() => {
    canIStayHere('game', { roomReducer, socketReducer })
      .then(
        () => {
          console.log('ca useEffectttttttttttttttttttttttttttttttttttttttt');
          if (!loaded) {
            socketReducer.socket.on('disconnect', () => {
              pleaseUnmountGame();
              nav(history, '/');
            });
            socketReducer.socket.on('refreshVue', (newGame, newSpec) => {
              console.log('ca refresh front');
              setNewGameInfo({
                ...gameReducer,
                ...newGame,
                spec: newSpec,
              });
            });
            socketReducer.socket.on('refreshRoomInfo', (newRoomInfo) => { setNewRoomInfo(dispatch, newRoomInfo); });
            socketReducer.socket.on('nowChillOutDude', (path) => {
              pleaseUnmountGame();
              history.replace(path);
            });
            socketReducer.socket.on('endGame', () => {
              console.log('unload', gameReducer);
              // keydownLoader('UNLOAD');
              window.removeEventListener('keydown', eventDispatcher);
              setIsOut(true); // pour faire un ptit 'mdr t mor'
              setLoaded(false);
              // dispatch({ type: 'UNLOAD_GAME' });
            });
            socketReducer.socket.on('theEnd', ({ winnerInfo }) => {
              console.log('the nd', winnerInfo);
              setTimeout(() => { setShowGoBack(true); }, 5000);
              dispatch({ type: "ADD_WINNER", value: winnerInfo });
              // setNewGameInfo({ ...gameReducer, winner: winnerInfo });
            });
            console.log('DidMount du game');
            if (!loaded && !gameReducer._isWaiting) {
              window.addEventListener('keydown', eventDispatcher);
              // dispatch({ type: 'LOAD_GAME' });
              // keydownLoader('LOAD');
              console.log('url', roomReducer.url);
              api.readyToStart(socketReducer.socket, roomReducer.url);
              setLoaded(true);
            }
          }
        },
        () => { nav(history, '/'); });
    return (() => console.log('real unmount game'));
  }, []);

  const pleaseUnmountGame = () => {
    if (!isEmpty(socketReducer)) {
      if (!isEmpty(socketReducer.socket))
        socketReducer.socket.removeAllListeners();
      if (loaded) {
        window.removeEventListener('keydown', eventDispatcher);
        setLoaded(false);
        // dispatch({ type: 'UNLOAD_GAME' });
      }
      dispatch({ type: 'DELETE_GAME_DATA' });
      // keydownLoader('UNLOAD');
      // setLoaded(false);
    }
  };

  const createSpec = (players) => {
    let ret = [];

    for (let player of players) {
      ret.push(
        <div className='blocSpec'>
          <div className="board" id='spec'>
            {createLines(player.lines, 'line', 'lineBloc', 'spec')}
          </div>
          <div className="nicknameSpec">{player.name}</div>
        </div>
      );
    }
    return (ret);
  };

  const createGameOverDisplay = () => {
    let returnToRoomButton = (roomReducer.owner === socketReducer.socket.id) ? (
      <button className="roomButton" id="leaveGame" onClick={() => {
        api.askEverybodyToCalmDown(socketReducer.socket, roomReducer.url);
        // pleaseUnmountGame();
      }}>
        <span className="textButton">flex</span>
      </button>) : undefined;
    let goBack = (showGoBack === true && !(roomReducer.owner === socketReducer.socket.id)) ? (
      <button className="roomButton" id="leaveGame" onClick={() => {
        let profil = roomReducer.listPlayers[socketReducer.socket.id]._profil;
        pleaseUnmountGame();
        history.replace(`/${roomReducer.url}[${profil.name}]`);
      }}>
        <span className="textButton">Go back</span>
      </button>) : undefined;

    if (gameReducer.winner !== undefined) {
      var finalText;

      if (!isEmpty(gameReducer.winner)) {
        finalText = (gameReducer.winner.id === socketReducer.socket.id) ? (
          <Fragment>
            <span className="textButton" id="gameOverTextReveal">what a pro you are, such a nice musculature!!! :Q</span>
            <span className="textButton" id="gameOverTextReveal">YOU are the real beaugosse!</span>
          </Fragment>
        ) : (
          <Fragment>
            <span className="textButton" id="gameOverTextReveal">but you lose, like the looser you are! :(((</span>
            <span className="textButton" id="gameOverTextReveal">{gameReducer.winner.name} is the real beaugosse!</span>
          </Fragment>);
      }

      return (
        <div className="gameOverDisplay">
          <div className="gameOverLayout">
            <div className="gameOverTitle">
              <span className="textButton" id="gameOverText">OMG GG WP DUUUDE</span>
              {finalText}
            </div>
            <div className="bottomButtons">
              {returnToRoomButton}
              {goBack}
            </div>
          </div>
        </div>
      );
    }
  };

  const specList = (gameReducer.spec && gameReducer.spec.length !== 0) ? [
    gameReducer.spec.slice(0, gameReducer.spec.length / 2),
    gameReducer.spec.slice(gameReducer.spec.length / 2)
  ] : undefined;
  const gameOverDisplay = (gameReducer.winner !== undefined) ? createGameOverDisplay() : undefined;

  return (
    <Fragment>
      <div className='display'>
        <div className="game" id="spec">
          <div className="spec">
            {specList ? createSpec(specList[0]) : undefined}
          </div>
        </div>
        <div className="game">
          <div className="board">
            {(gameReducer.lines) ? createLines(gameReducer.lines, 'line', 'lineBloc') : undefined}
          </div>
          <div className="rightPanel">
            <div className="nextText">NEXT :</div>
            <div className="nextPiece">
              {gameReducer.tetri !== undefined ? createLines(gameReducer.tetri.nextShape, 'lineNext', 'lineBlocNext', undefined, gameReducer.tetri.nextId) : undefined}
            </div>
            <div className="score">Score :<br />00</div>
          </div>
        </div>
        <div className="game" id="spec">
          <div className="spec">
            {specList ? createSpec(specList[1]) : undefined}
          </div>
        </div>
      </div>
      {gameOverDisplay}
    </Fragment>
  );
};


const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Game);