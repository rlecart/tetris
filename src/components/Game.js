import React, { Fragment } from 'react';
import { connect } from "react-redux";

import colors from '../ressources/colors.js';
import api from '../api/clientApi.js';
import { canIStayHere, isEmpty } from '../misc/utils.js';
import nav from "../misc/nav";
import defaultGame from '../ressources/game';

const Game = (props) => {
  const socket = props.socketConnector.socket;
  const [displayLines, setDisplayLines] = React.useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [spec, setSpec] = React.useState([]);
  const [winner, setWinner] = React.useState(undefined);
  const [isOut, setIsOut] = React.useState(false);
  const [showGoBack, setShowGoBack] = React.useState(false);
  const [tetri, setTetri] = React.useState(defaultGame.tetri);
  const [interval, setInterval] = React.useState(undefined);
  // state = {
  //   lines: [
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   ],
  //   spec: [],
  //   winner: undefined,
  //   isOut: false,
  //   isOwner: false,
  //   showGoBack: false,
  // };

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
    let newDisplayLines = displayLines;

    for (let line in newDisplayLines) {
      for (let char in newDisplayLines[line]) {
        newDisplayLines[line][char]++;
        newDisplayLines[line][char] = (newDisplayLines[line][char] % 9);
      }
    }
    setDisplayLines(newDisplayLines);
  };

  const eventDispatcher = (event) => {
    const url = props.roomReducer.roomInfo.url;

    if (event.key === "z")
      acidMode();
    else if (event.key === 'ArrowRight')
      api.move('right', url, socket);
    else if (event.key === 'ArrowLeft')
      api.move('left', url, socket);
    else if (event.key === ' ')
      api.move('down', url, socket);
    else if (event.key === 'ArrowUp')
      api.move('turn', url, socket);
    else if (event.key === 'ArrowDown')
      api.move('stash', url, socket);
    else if (event.key === 'c') {
      api.askToEndGame(socket, url);
    }
  };

  const refreshGame = (game, spec) => {
    let newDisplayLines = displayLines;
    let newTetri = tetri;
    let newInterval = interval;
    let newSpec = spec;

    newDisplayLines = game._lines;
    newTetri = game._tetri;
    newInterval = game._interval;
    newSpec = spec;
    setDisplayLines(newDisplayLines);
    setTetri(newTetri);
    setInterval(newInterval);
    setSpec(newSpec);
  };

  const refreshRoomInfo = (newRoomInfo) => {
    let action = {
      type: 'SYNC_ROOM_DATA',
      value: newRoomInfo,
    };

    if (!newRoomInfo || isEmpty(newRoomInfo))
      return (-1);
    setSpec(newRoomInfo.spec);
    setWinner(newRoomInfo.winner);
    setIsOut(newRoomInfo.isOut);
    setTetri(newRoomInfo.tetri);
    setInterval(newRoomInfo.interval);
    props.dispatch(action);
  };

  React.useEffect(() => {
    socket.removeAllListeners();
    canIStayHere('game', props)
      .then(
        () => {
          socket.on('disconnect', () => {
            pleaseUnmountGame();
            nav(props.history, '/');
          });
          socket.on('refreshVue', (game, spec) => { refreshGame(game, spec); });
          socket.on('refreshRoomInfo', (newRoomInfo) => { refreshRoomInfo(newRoomInfo); });
          socket.on('nowChillOutDude', (path) => {
            pleaseUnmountGame();
            props.history.replace(path);
          });
          socket.on('endGame', () => {
            keydownLoader('UNLOAD');
            setIsOut(true); // pour faire un ptit 'mdr t mor'
          });
          socket.on('theEnd', ({ winnerInfo }) => {
            setTimeout(() => { setShowGoBack(true); }, 5000);
            setWinner(winnerInfo);
          });
          console.log('DidMount du game')
          keydownLoader('LOAD');
          api.readyToStart(socket, props.roomReducer.roomInfo.url);
        },
        () => { nav(props.history, '/'); });
    return (() => console.log('real unmount game'));
  }, []);

  const keydownLoader = (toLoad) => {
    const alreadyLoaded = (toLoad === 'LOAD') ? false : true;
    const gameEvents = (toLoad === 'LOAD') ? 'GAME_EVENTS_LOADED' : 'GAME_EVENTS_UNLOADED';
    const eventFunction = (toLoad === 'LOAD') ? window.addEventListener : window.removeEventListener;

    if (toLoad === 'LOAD' || toLoad === 'UNLOAD') {
      if (props.socketConnector.areGameEventsLoaded === alreadyLoaded) {
        eventFunction("keydown", eventDispatcher);
        const action = { type: gameEvents };
        props.dispatch(action);
      }
    }
  };

  const pleaseUnmountGame = () => {
    if (!isEmpty(props.socketConnector)) {
      if (!isEmpty(props.socketConnector.socket))
        props.socketConnector.socket.removeAllListeners();
      keydownLoader('UNLOAD');
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
    let returnToRoomButton = (props.roomReducer.roomInfo.owner === socket.id) ? (
      <button className="roomButton" id="leaveGame" onClick={() => {
        api.askEverybodyToCalmDown(socket, props.roomReducer.roomInfo.url);
      }}>
        <span className="textButton">flex</span>
      </button>) : undefined;
    let goBack = (showGoBack === true && !(props.roomReducer.roomInfo.owner === socket.id)) ? (
      <button className="roomButton" id="leaveGame" onClick={() => {
        let profil = props.roomReducer.roomInfo.listPlayers[socket.id]._profil;
        props.history.replace(`/${profil.url}[${profil.name}]`);
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

  const specList = (spec.length !== 0) ? [
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