import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";

import colors from '../ressources/colors.js';
import api from '../api/clientApi.js';
import { canIStayHere, isEmpty } from '../misc/utils.js';
import nav from "../misc/nav";

class Game extends Component {
  socket = this.props.socketConnector.socket;
  state = {
    lines: [
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
    ],
    spec: [],
    winner: undefined,
    isOut: false,
    isOwner: false,
    showGoBack: false,
  };
  // isOwner = this.props.roomReducer.roomInfo.listPlayers[socket.id].profil.owner

  createbloc(bloc, blocClass, id, idTetri) {
    let col = (idTetri && bloc !== 0) ? idTetri : bloc;

    return (<div className={blocClass} id={id} style={{ backgroundColor: colors[col] }} />);
  }

  createLine(line, blocClass, id, idTetri) {
    let ret = [];

    for (let bloc of line)
      ret.push(this.createbloc(bloc, blocClass, id, idTetri));
    return (ret);
  }

  createLines(lines, lineClass, blocClass, id, idTetri) {
    let ret = [];

    if (idTetri === 5 && lines.length < 3)
      lines.unshift(new Array(lines[0].length).fill(0));
    for (let line of lines) {
      ret.push(
        <div className={lineClass}>
          {this.createLine(line, blocClass, id, idTetri)}
        </div>
      );
    }
    return (ret);
  }

  acidMode(state) {
    for (let line in state.lines) {
      for (let char in state.lines[line]) {
        state.lines[line][char]++;
        state.lines[line][char] = (state.lines[line][char] % 9);
      }
    }
    this.setState(state);
  }

  eventDispatcher = (event) => {
    const state = this.state;
    const socket = this.socket;
    const url = this.props.roomReducer.roomInfo.url;

    if (event.key === "z")
      this.acidMode(state);
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

  refreshGame(game, spec, context) {
    console.log('hop ca refresh');
    const state = context.state;

    state.lines = game._lines;
    state.tetri = game._tetri;
    state.interval = game._interval;
    state.spec = spec;
    context.setState(state);
  }

  componentDidMount() {
    console.log('game');
    canIStayHere('game', this.props)
      .then(
        () => {
          console.log('jpeux rester');
          console.log('socket = ', this.socket);
          this.socket.on('refreshVue', (game, spec) => { this.refreshGame(game, spec, this); });
          this.socket.on('nowChillOutDude', (path) => this.props.history.replace(path));
          this.socket.on('endGame', () => {
            if (this.props.socketConnector.areGameEventsLoaded === true) {
              window.removeEventListener('keydown', this.eventDispatcher);
              const action = { type: 'GAME_EVENTS_UNLOADED' };
              this.props.dispatch(action);
            }
            this.setState({ ...this.state, isOut: true });
          });
          this.socket.on('theEnd', ({ winnerInfo }) => {
            setTimeout(() => { this.setState({ showGoBack: true }); }, 5000);
            this.setState({ ...this.state, winner: winnerInfo, });
          });
          if (this.props.socketConnector.areGameEventsLoaded === false) {
            window.addEventListener("keydown", this.eventDispatcher);
            const action = { type: 'GAME_EVENTS_LOADED' };
            this.props.dispatch(action);
          }
          api.readyToStart(this.socket, this.props.roomReducer.roomInfo.url);
          console.log('hop le RTS');
        },
        () => { nav(this.props.history, '/'); });
  }

  componentWillUnmount() {
    if (!isEmpty(this.props.socketConnector)) {
      if (!isEmpty(this.props.socketConnector.socket))
        this.props.socketConnector.socket.removeAllListeners();
      if (this.props.socketConnector.areGameEventsLoaded === true) {
        window.removeEventListener('keydown', this.eventDispatcher);
        const action = { type: 'GAME_EVENTS_UNLOADED' };
        this.props.dispatch(action);
      }
    }
  }

  createSpec(players) {
    let ret = [];

    for (let player of players) {
      ret.push(
        <div className='blocSpec'>
          <div className="board" id='spec'>
            {this.createLines(player.lines, 'line', 'lineBloc', 'spec')}
          </div>
          <div className="nicknameSpec">{player.name}</div>
        </div>
      );
    }
    return (ret);
  }

  createGameOverDisplay() {
    let returnToRoomButton = (this.state.owner === this.socket.id) ? (
      <button className="roomButton" id="leaveGame" onClick={() => {
        api.askEverybodyToCalmDown(this.socket, this.props.roomReducer.roomInfo.url);
      }}>
        <span className="textButton">flex</span>
      </button>) : undefined;
    let goBack = (this.state.showGoBack === true && this.state.owner === this.socket.id) ? (
      <button className="roomButton" id="leaveGame" onClick={() => {
        let profil = this.props.roomReducer.roomInfo.listPlayers[this.socket.id]._profil;
        this.props.history.replace(`/${profil.url}[${profil.name}]`);
      }}>
        <span className="textButton">Go back</span>
      </button>) : undefined;

    if (this.state.winner !== undefined) {
      var finalText;

      if (Object.keys(this.state.winner).length !== 0) {
        finalText = (this.state.winner.id === this.props.socketConnector.socket.id) ? (
          <Fragment>
            <span className="textButton" id="gameOverTextReveal">what a pro you are, such a nice musculature!!! :Q</span>
            <span className="textButton" id="gameOverTextReveal">YOU are the real beaugosse!</span>
          </Fragment>
        ) : (
          <Fragment>
            <span className="textButton" id="gameOverTextReveal">but you lose, like the looser you are! :(((</span>
            <span className="textButton" id="gameOverTextReveal">{this.state.winner.name} is the real beaugosse!</span>
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
  }

  render() {
    let spec = (this.state.spec.length !== 0) ? [
      this.state.spec.slice(0, this.state.spec.length / 2),
      this.state.spec.slice(this.state.spec.length / 2)
    ] : undefined;
    let gameOverDisplay = this.createGameOverDisplay();

    return (
      <Fragment>
        <div className='display'>
          <div className="game" id="spec">
            <div className="spec">
              {spec ? this.createSpec(spec[0]) : undefined}
            </div>
          </div>
          <div className="game">
            <div className="board">
              {this.createLines(this.state.lines, 'line', 'lineBloc')}
            </div>
            <div className="rightPanel">
              <div className="nextText">NEXT :</div>
              <div className="nextPiece">
                {this.state.tetri !== undefined ? this.createLines(this.state.tetri.nextShape, 'lineNext', 'lineBlocNext', undefined, this.state.tetri.nextId) : undefined}
              </div>
              <div className="score">Score :<br />00</div>
            </div>
          </div>
          <div className="game" id="spec">
            <div className="spec">
              {spec ? this.createSpec(spec[1]) : undefined}
            </div>
          </div>
        </div>
        {gameOverDisplay}
      </Fragment>
    );
  }
}


const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Game);