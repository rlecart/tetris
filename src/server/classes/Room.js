import defaultRules from '../../client/ressources/defaultRules.js';
import Player from './Player.js';
import _ from 'lodash';
import { refresh, initShapes, addTetri } from '../refresh.js';

export default class Room {
  constructor() {
    this._url = '';
    this._inGame = false;
    this._nbPlayer = 0;
    this._listPlayers = {};
    this._rules = _.cloneDeep(defaultRules);
    this._isOut = {};


    this._interval = undefined;
    this._shapes = [];
    this._shapesId = [];

    this._readyToStart = {};

    this._sioList = {};
    this._owner = undefined;
    this._arrivalOrder = [];
    this._pending = true;
  }

  getSio(id) {
    if (id !== undefined)
      return (this._sioList[id]);
    return (this._sioList);
  }

  getUrl() {
    return (this._url);
  }

  getListPlayers(player) {
    if (player !== undefined)
      return (this._listPlayers[player]);
    return (this._listPlayers);
  }

  getNbPlayer() {
    return (this._nbPlayer);
  }

  getShapes(i) {
    if (i !== undefined)
      return (this._shapes[i]);
    return (this._shapes);
  }

  getShapesId(i) {
    if (i !== undefined)
      return (this._shapesId[i]);
    return (this._shapesId);
  }

  getReadyToStart() {
    return (this._readyToStart);
  }

  getRules() {
    return (this._rules);
  }

  getInterval() {
    return (this._interval);
  }

  getOwner() {
    return (this._owner);
  }

  getArrivalOrder() {
    return (this._arrivalOrder);
  }

  getRoomInfo() {
    let roomInfo = {};

    roomInfo.url = this._url;
    roomInfo.inGame = this._inGame;
    roomInfo.nbPlayer = this._nbPlayer;
    roomInfo.rules = this._rules;
    roomInfo.listPlayers = this._listPlayers;
    roomInfo.owner = this._owner;
    return (roomInfo);
  }

  getAllGames(only, exception) {
    let ret = {};
    let playersList = {};

    if (only !== undefined)
      return (this.getListPlayers(only).getGame());
    else
      playersList = this.getListPlayers();
    for (let [key, value] of Object.entries(playersList)) {
      if (key !== exception && key !== undefined)
        ret = { ...ret, [key]: value.getGame() };
    }
    return (ret);
  }

  isOut(id) {
    if (this._isOut !== undefined)
      return (this._isOut[id]);
  }

  isInGame() {
    return (this._inGame);
  }

  isPending() {
    return (this._pending);
  }

  isOwner(id) {
    if (this._owner === id)
      return (true);
    return (false);
  }

  addSio(sio) {
    if (sio && sio.id)
      this._sioList = { ...this._sioList, [sio.id]: sio };
  }

  removeSio(id) {
    this._sioList = { ...this._sioList, [id]: undefined };
    delete this._sioList[id];
  }

  setUrl(url) {
    this._url = url;
  }

  addOut(id) {
    this._isOut = { ...this._isOut, [id]: id };

    if (Object.keys(this._isOut).length >= this._nbPlayer - 1) {
      let winnerInfo = {};
      let winnerId;

      if (this.getNbPlayer() > 1) {
        for (let key of Object.keys(this.getListPlayers())) {
          if (this._isOut[key] === undefined)
            winnerId = key;
        }
        winnerInfo = {
          name: String(this.getListPlayers(winnerId).getName()),
          id: winnerId,
        };
      }
      this._isOut = undefined;
      this.endGame();
      this.emitAll('theEnd', undefined, { winnerInfo });
      for (let player of Object.values(this.getListPlayers()))
        player.setGame(undefined);
    }
  }

  setInGame(value) {
    this._inGame = value;
  }

  endGame(res) {
    clearInterval(this._interval);
    this.setPending(true);
    this._interval = undefined;
    this.setInGame(undefined);
    setTimeout(() => {
      this._shapes = [];
      this._shapesId = [];
      this.setInGame(false);
      if (res !== undefined)
        res();
    }, 1500);
  }

  resetUrl() {
    this._url = undefined;
  }

  addNewPlayer(clientId, profil) {
    let owner = false;

    if (this._nbPlayer === 0) {
      this._owner = clientId;
      owner = true;
    }
    profil = { ...profil, owner: owner };
    this._arrivalOrder.push(clientId);
    this._listPlayers = { ...this._listPlayers, [clientId]: new Player(profil, clientId, this) };
    this._nbPlayer++;
  }

  setPending(value) {
    this._pending = value;
  }

  addReadyToStart(clientId) {
    this._readyToStart = { ...this._readyToStart, [clientId]: true };
  }

  addNewShape(shape) {
    this._shapes.push(shape);
  }

  addShapesId(id) {
    this._shapesId.push(id);
  }

  setAllGames(games) {
    for (let [id, client] of Object.entries(this.getListPlayers()))
      client.setGame(games[id]);
  }

  resetReadyToStart() {
    this._readyToStart = undefined;
  }

  removePlayer(clientId) {
    this._nbPlayer--;
    if (this._owner === clientId) {
      if (this._nbPlayer > 0) {
        this._owner = this._arrivalOrder[1];
        this._listPlayers[this._owner]._profil.owner = true;
      }
    }
    this._arrivalOrder.splice(this._arrivalOrder.indexOf(clientId), 1);
    if (this.isOut(clientId) !== undefined)
      delete this._isOut[clientId];
    delete this._listPlayers[clientId];
    delete this._sioList[clientId];
    this.emitAll('refreshRoomInfo', clientId, this.getRoomInfo());
  }

  launchGame(sio) {
    initShapes(this);
    this.initGames();
    this.setInGame(true);
    this.setPending(false);
    this._interval = setInterval(this.gameLoop.bind(this), 1000, this.getSio(), this.getUrl());
    this._readyToStart = undefined;
  }

  hiddenSpec(ret) {
    let hiddenCols = new Array(ret.length);

    for (let player in ret) {
      hiddenCols[player] = new Array(ret[player].lines[0].length).fill(false);
      for (let line in ret[player].lines) {
        for (let i in ret[player].lines[line]) {
          if (hiddenCols[player][i] === false && ret[player].lines[line][i] !== 0 && ret[player].lines[line][i] !== 1)
            hiddenCols[player][i] = true;
          else if (hiddenCols[player][i] === true)
            ret[player].lines[line][i] = 1;
        }
      }
    }
    hiddenCols = null;
    return (ret);
  }

  createSpecList(exception) {
    let hidden = true;
    let retHidden = [];
    let ret = [];

    for (let [id, player] of Object.entries(this.getListPlayers())) {
      if (id !== exception && player && player.getGame() && player.getGame().getSpec()) {
        ret.push({
          lines: _.cloneDeep(player.getGame().getSpec()),
          name: player.getName(),
        });
      }
    }
    if (this.getNbPlayer() > 1 && ret) {
      if (hidden)
        retHidden = this.hiddenSpec(ret);
      return (retHidden);
    }
    return (ret);
  }

  initGames() {
    for (let player of Object.values(this.getListPlayers())) {
      player.setNewGame(this.getShapes(), this.getShapesId());
    }
  }

  flatGames(only) {
    let ret;

    if (only !== undefined && !this.isOut(only)) {
      ret = _.cloneDeep(this.getAllGames(only));
      addTetri(ret);
      return (ret.formatIt());
    }
  }

  refreshAllVues(socketClients, url, exception) {
    for (let [id, client] of Object.entries(socketClients)) {
      if (this.isInGame() === true && id !== exception) {
        let flatGame = this.flatGames(id);
        client.emit('refreshVue', flatGame, this.createSpecList(id));
      }
    }
  }

  gameLoop(socketClients, url) {
    // let gamesTmp = _.cloneDeep(this.getAllGames());
    let gamesTmp = this.getAllGames();

    for (let id of Object.keys(socketClients)) {
      if (this.isInGame() === true && !this.isOut(id))
        gamesTmp[id] = refresh(gamesTmp[id], this, id);
    }
    if (this.isInGame() === true) {
      this.setAllGames(gamesTmp);
      this.refreshAllVues(socketClients, url);
    }
  }

  emitAll(message, except, obj, spec) {
    let clientList = this.getSio();

    for (let [id, client] of Object.entries(clientList)) {
      if (id !== except) {
        client.emit(message, obj, spec);
      }
    }
  }

  emitOnly(message, only, obj, spec) {
    let clientList = this.getSio();

    for (let [id, client] of Object.entries(clientList)) {
      if (id === only)
        client.emit(message, obj, spec);
    }
  }
};
