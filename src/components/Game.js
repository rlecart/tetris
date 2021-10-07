import React, { Fragment } from 'react';
import { connect } from "react-redux";

import colors from '../ressources/colors.js';
import api from '../api/clientApi.js';
import { canIStayHere, isEmpty } from '../misc/utils.js';
import nav from "../misc/nav";
import defaultGame from '../ressources/game';
import { setNewRoomInfo } from '../Store/Reducers/roomReducer.js';

const Game = (props) => {
  const [loaded, setLoaded] = React.useState(props.socketConnector.areGameEventsLoaded);
  // const loaded = props.socketConnector.areGameEventsLoaded;
  const [isOut, setIsOut] = React.useState(false);
  const [showGoBack, setShowGoBack] = React.useState(false);
  const socket = props.socketConnector.socket;
  const displayLines = (props.gameReducer && props.gameReducer.game) ? props.gameReducer.game._lines : defaultGame.lines;
  const spec = (props.gameReducer && props.gameReducer.game) ? props.gameReducer.game.spec : undefined;
  const winner = (props.gameReducer && props.gameReducer.game) ? props.gameReducer.game.winner : undefined;
  const tetri = (props.gameReducer && props.gameReducer.game) ? props.gameReducer.game._tetri : defaultGame.tetri;
  const interval = (props.gameReducer && props.gameReducer.game) ? props.gameReducer.game.interval : undefined;
  const gameInfo = (props.gameReducer) ? props.gameReducer.game : undefined;
  const roomInfo = (props.roomReducer) ? props.roomReducer.roomInfo : undefined;
  const roomUrl = (roomInfo) ? roomInfo.url : undefined;
  console.log('\n\nprops = ', props);

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
    let action = {
      type: 'SYNC_GAME_DATA',
      value: newGameInfo,
    };

    console.log('newGameInfo = ', newGameInfo);
    props.dispatch(action);
  };

  const acidMode = () => {
    let newDisplayLines = displayLines;

    for (let line in newDisplayLines) {
      for (let char in newDisplayLines[line]) {
        newDisplayLines[line][char]++;
        newDisplayLines[line][char] = (newDisplayLines[line][char] % 9);
      }
    }
    setNewGameInfo({ ...gameInfo, _lines: newDisplayLines });
  };

  const eventDispatcher = (event) => {
    console.log(event.key);
    if (event.key === "z")
      acidMode();
    else if (event.key === 'ArrowRight')
      api.move('right', roomUrl, socket);
    else if (event.key === 'ArrowLeft')
      api.move('left', roomUrl, socket);
    else if (event.key === ' ')
      api.move('down', roomUrl, socket);
    else if (event.key === 'ArrowUp')
      api.move('turn', roomUrl, socket);
    else if (event.key === 'ArrowDown')
      api.move('stash', roomUrl, socket);
    else if (event.key === 'c') {
      api.askToEndGame(socket, roomUrl);
    }
  };

  React.useEffect(() => {
    canIStayHere('game', props)
      .then(
        () => {
          console.log('ca useEffectttttttttttttttttttttttttttttttttttttttt')
          if (!loaded) {
            socket.on('disconnect', () => {
              pleaseUnmountGame();
              nav(props.history, '/');
            });
            socket.on('refreshVue', (newGame, newSpec) => {
              console.log('ca refresh front');
              setNewGameInfo({
                ...gameInfo,
                ...newGame,
                spec: newSpec,
              });
            });
            socket.on('refreshRoomInfo', (newRoomInfo) => { setNewRoomInfo(props.dispatch, newRoomInfo); });
            socket.on('nowChillOutDude', (path) => {
              pleaseUnmountGame();
              props.history.replace(path);
            });
            socket.on('endGame', () => {
              console.log('unload', gameInfo);
              keydownLoader('UNLOAD');
              // window.removeEventListener('keydown', eventDispatcher);
              setIsOut(true); // pour faire un ptit 'mdr t mor'
            });
            socket.on('theEnd', ({ winnerInfo }) => {
              console.log('the end', gameInfo);
              setTimeout(() => { setShowGoBack(true); }, 5000);
              // setNewGameInfo({ ...gameInfo, winner: winnerInfo });
            });
            console.log('DidMount du game');
            keydownLoader('LOAD');
            api.readyToStart(socket, roomUrl);
          }
        },
        () => { nav(props.history, '/'); });
    return (() => console.log('real unmount game'));
  }, []);

  const keydownLoader = (toLoad) => {
    // const alreadyLoaded = ((toLoad === 'LOAD' && loaded === true) || (toLoad === 'UNLOAD' && loaded === false)) ? true : false
    const gameEvents = (toLoad === 'LOAD') ? 'GAME_EVENTS_LOADED' : 'GAME_EVENTS_UNLOADED';
    // const addOrRemovea = (toLoad === 'LOAD') ? window.addEventListener : window.removeEventListener;

    console.log('loader 1');
    if (toLoad === 'LOAD' || toLoad === 'UNLOAD') {
      console.log('aaa = ', props.socketConnector)
      console.log('loader 2', toLoad, gameEvents);
      // console.log('loader 2', alreadyprops.socketConnector.areGameEventsLoaded);
      if ((toLoad === 'UNLOAD' && props.socketConnector.areGameEventsLoaded) || (toLoad === 'LOAD' && !props.socketConnector.areGameEventsLoaded)) {
        console.log('loader 3');
        if (toLoad === 'LOAD')
          window.addEventListener('keydown', eventDispatcher);
        else if (toLoad === 'UNLOAD') {
          console.log('\n\narretez tout omgggg \n\n')
          window.removeEventListener('keydown', eventDispatcher);
        }
        // addOrRemovea("keydown", eventDispatcher);
        const action = { type: gameEvents };
        console.log('juste avant le dispatch', toLoad, gameEvents);
        console.log('le areloaded = ', props.socketConnector.areGameEventsLoaded)
        props.dispatch(action);
        console.log('le areloaded = ', props.socketConnector.areGameEventsLoaded)
      }
    }
  };

  const pleaseUnmountGame = () => {
    if (!isEmpty(props.socketConnector)) {
      if (!isEmpty(props.socketConnector.socket))
        socket.removeAllListeners();
      keydownLoader('UNLOAD');
      setLoaded(false);
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
    let returnToRoomButton = (roomInfo.owner === socket.id) ? (
      <button className="roomButton" id="leaveGame" onClick={() => {
        api.askEverybodyToCalmDown(socket, roomUrl);
      }}>
        <span className="textButton">flex</span>
      </button>) : undefined;
    let goBack = (showGoBack === true && !(roomInfo.owner === socket.id)) ? (
      <button className="roomButton" id="leaveGame" onClick={() => {
        let profil = roomInfo.listPlayers[socket.id]._profil;
        props.history.replace(`/${roomUrl}[${profil.name}]`);
      }}>
        <span className="textButton">Go back</span>
      </button>) : undefined;

    if (winner !== undefined) {
      var finalText;

      if (!isEmpty(winner)) {
        finalText = (winner.id === socket.id) ? (
          <Fragment>
            <span className="textButton" id="gameOverTextReveal">what a pro you are, such a nice musculature!!! :Q</span>
            <span className="textButton" id="gameOverTextReveal">YOU are the real beaugosse!</span>
          </Fragment>
        ) : (
          <Fragment>
            <span className="textButton" id="gameOverTextReveal">but you lose, like the looser you are! :(((</span>
            <span className="textButton" id="gameOverTextReveal">{winner.name} is the real beaugosse!</span>
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

  const specList = (spec && spec.length !== 0) ? [
    spec.slice(0, spec.length / 2),
    spec.slice(spec.length / 2)
  ] : undefined;
  const gameOverDisplay = createGameOverDisplay();

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
            {createLines(displayLines, 'line', 'lineBloc')}
          </div>
          <div className="rightPanel">
            <div className="nextText">NEXT :</div>
            <div className="nextPiece">
              {tetri !== undefined ? createLines(tetri.nextShape, 'lineNext', 'lineBlocNext', undefined, tetri.nextId) : undefined}
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