import React, { Fragment } from 'react';
import { connect } from "react-redux";

import colors from '../../ressources/defaultColors.js';
import api from '../api/clientApi.js';
import { canIStayHere, isEmpty } from '../../misc/utils.js';

import { setNewRoomInfo } from '../actions/roomAction.js';
import { setNewGameInfo, addWinner, deleteGameData } from '../actions/gameAction.js';

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
  const isMounted = React.useRef(false);
  const loaded = React.useRef(false);
  let [isOut, setIsOut] = React.useState(false);
  let [showGoBack, setShowGoBack] = React.useState(false);

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

  const acidMode = () => {
    console.log('gamereduc = ', gameReducer);
    let newDisplayLines = gameReducer.lines;

    for (let line in newDisplayLines) {
      for (let char in newDisplayLines[line]) {
        // newDisplayLines[line][char]++;
        newDisplayLines[line][char] = (newDisplayLines[line][char] + 1) % 9;
      }
    }
    setNewGameInfo(dispatch, { ...gameReducer, lines: newDisplayLines });
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
    isMounted.current = true;
    canIStayHere('game', { roomReducer, socketReducer })
      .then(
        () => {
          console.log('ca useEffectttttttttttttttttttttttttttttttttttttttt');
          if (!loaded.current) {
            socketReducer.socket.on('disconnect', () => {
              pleaseUnmountGame();
              history.push('/');
            });
            socketReducer.socket.on('refreshVue', (newGame, newSpec) => {
              console.log('ca refresh front', gameReducer);
              setNewGameInfo(dispatch, { ...newGame, spec: newSpec, });
              if (!loaded.current) {
                window.addEventListener('keydown', eventDispatcher);
                loaded.current = true;
              }
            });
            socketReducer.socket.on('refreshRoomInfo', (newRoomInfo) => { setNewRoomInfo(dispatch, newRoomInfo); });
            socketReducer.socket.on('nowChillOutDude', (path) => {
              pleaseUnmountGame();
              history.replace(path);
            });
            socketReducer.socket.on('endGame', () => {
              console.log('unload', gameReducer);
              window.removeEventListener('keydown', eventDispatcher);
              setIsOut(true); // pour faire un ptit 'mdr t mor'
            });
            socketReducer.socket.on('theEnd', ({ winnerInfo }) => {
              console.log('the end', winnerInfo);
              setTimeout(() => {
                if (isMounted.current)
                  setShowGoBack(true);
              }, 5000);
              addWinner(dispatch, winnerInfo);
            });
            console.log('DidMount du game');
            if (!loaded.current)
              api.readyToStart(socketReducer.socket, roomReducer.url);
          }
        },
        () => { history.push('/'); });
    return (() => isMounted.current = false);
  }, []);

  const pleaseUnmountGame = () => {
    if (!isEmpty(socketReducer)) {
      if (!isEmpty(socketReducer.socket))
        socketReducer.socket.removeAllListeners();
      if (loaded.current) {
        window.removeEventListener('keydown', eventDispatcher);
        loaded.current = false;
        // dispatch({ type: 'UNLOAD_GAME' });
      }
      deleteGameData(dispatch);
      // keydownLoader('UNLOAD');
      // loaded.current = false;
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