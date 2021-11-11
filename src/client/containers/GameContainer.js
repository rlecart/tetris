import React, { Fragment } from 'react';
import { connect } from "react-redux";

import api from '../api/clientApi.js';
import { canIStayHere, isEmpty } from '../../misc/utils.js';

import { setNewRoomInfo } from '../actions/roomAction.js';
import { setNewGameInfo, addWinner, deleteGameData, acidMode, stopAcidMode } from '../actions/gameAction.js';
import GameOverContainer from './GameOverContainer.js';
import GamePanel from '../components/GamePanel.js';
import SpecListContainer from './SpecListContainer.js';
import LinesContainer from './LinesContainer.js';
import Display from '../components/Display.js';

const GameContainer = ({
  dispatch,
  history,
  socketReducer,
  roomReducer,
  gameReducer,
}) => {
  const isMounted = React.useRef(false);
  const loaded = React.useRef(false);
  const gameOverTimeout = React.useRef();
  const [isOut, setIsOut] = React.useState(false);
  const [showGoBack, setShowGoBack] = React.useState(false);


  const eventDispatcher = (event) => {
    console.log('event.key = ', event.key);
    if (event.key === "z")
      acidMode(dispatch);
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

  React.useEffect(async () => {
    if (!isMounted.current) {
      await canIStayHere('game', { roomReducer, socketReducer })
        .then(
          () => {
            isMounted.current = true;
            // console.log('ca useEffectttttttttttttttttttttttttttttttttttttttt');
            socketReducer.socket.on('disconnect', () => {
              pleaseUnmountGame('completly');
              history.push('/');
            });
            socketReducer.socket.on('refreshVue', (newGame, newSpec) => {
              // console.log('ca refresh front');
              let ret = { ...gameReducer, spec: newSpec };
              if (newGame)
                ret = { ...newGame, spec: newSpec };
              setNewGameInfo(dispatch, ret);
              if (!loaded.current) {
                window.addEventListener('keydown', eventDispatcher);
                loaded.current = true;
              }
            });
            socketReducer.socket.on('refreshRoomInfo', (newRoomInfo) => { setNewRoomInfo(dispatch, newRoomInfo); });
            socketReducer.socket.on('nowChillOutDude', (path) => {
              pleaseUnmountGame('completly');
              history.replace(path);
            });
            socketReducer.socket.on('endGame', () => {
              // console.log('unload', gameReducer);
              window.removeEventListener('keydown', eventDispatcher);
              // console.log(gameReducer);
              stopAcidMode(dispatch);
              setIsOut(true); // pour faire un ptit 'mdr t mor'
            });
            socketReducer.socket.on('theEnd', ({ winnerInfo }) => {
              // console.log('the end', winnerInfo);
              window.removeEventListener('keydown', eventDispatcher);
              gameOverTimeout.current = setTimeout(() => {
                // console.log('gameOverTimeout');
                if (isMounted.current)
                  setShowGoBack(true);
              }, 5000);
              addWinner(dispatch, winnerInfo);
            });
            // console.log('DidMount du game');
            if (!loaded.current)
              api.readyToStart(socketReducer.socket, roomReducer.url);
          })
        .catch(() => { history.push('/'); });
    }
    return (() => {
      socketReducer.socket.removeAllListeners();
      isMounted.current = false;
    });
  }, [gameReducer]);

  const pleaseUnmountGame = (completly) => {
    if (!isEmpty(socketReducer)) {
      if (!isEmpty(socketReducer.socket))
        socketReducer.socket.removeAllListeners();
      if (completly) {
        if (loaded.current) {
          window.removeEventListener('keydown', eventDispatcher);
          loaded.current = false;
          clearTimeout(gameOverTimeout.current);
          gameOverTimeout.current = undefined;
        }
        deleteGameData(dispatch);
        stopAcidMode(dispatch);
      }
    }
  };

  const specList = (gameReducer.spec && gameReducer.spec.length !== 0) ? [
    <SpecListContainer specList={gameReducer.spec.slice(0, gameReducer.spec.length / 2)} />,
    <SpecListContainer specList={gameReducer.spec.slice(gameReducer.spec.length / 2)} />
  ] : [undefined, undefined];

  const gameOverDisplay = (gameReducer.winner !== undefined) ?
    <GameOverContainer
      socketReducer={socketReducer}
      roomReducer={roomReducer}
      gameReducer={gameReducer}
      showGoBack={showGoBack}
      api={api}
      pleaseUnmountGame={pleaseUnmountGame}
      history={history} />
    : undefined;

  const displayLines = (gameReducer.lines) ?
    <LinesContainer
      lines={gameReducer.lines}
      lineClass={'line'}
      blocClass={'lineBloc'} />
    : undefined;

  const nextTetri = (gameReducer.tetri !== undefined) ?
    <LinesContainer
      lines={gameReducer.tetri.nextShape}
      lineClass={'lineNext'}
      blocClass={'lineBlocNext'}
      id={undefined}
      idTetri={gameReducer.tetri.nextId} />
    : undefined;

  return (
    <Fragment>
      <Display>
        {specList[0]}
        <GamePanel displayLines={displayLines} nextTetri={nextTetri} />
        {specList[1]}
      </Display>
      {gameOverDisplay}
    </Fragment>
  );
};


const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(GameContainer);