import defaultRules from '../../ressources/defaultRules.js';
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


    this._roomInterval = undefined;
    this._shapes = [];
    this._shapesId = [];

    this._readyToStart = {};

    this._sioList = {};
    this._owner = undefined;
    this._arrivalOrder = [];
    this._isPending = true;
  }

  get sioList() {
    return (this._sioList);
  }

  set sioList(value) {
    this._sioList = value;
  }

  get url() {
    return (this._url);
  }

  set url(value) {
    this._url = value;
  }

  get listPlayers() {
    return (this._listPlayers);
  }

  set listPlayers(value) {
    this._listPlayers = value;
  }

  get nbPlayer() {
    return (this._nbPlayer);
  }

  set nbPlayer(value) {
    this._nbPlayer = value;
  }

  get shapes() {
    return (this._shapes);
  }

  set shapes(value) {
    this._shapes = value;
  }

  get shapesId() {
    return (this._shapesId);
  }

  set shapesId(value) {
    this._shapesId = value;
  }

  get readyToStart() {
    return (this._readyToStart);
  }

  set readyToStart(value) {
    this._readyToStart = value;
  }

  get rules() {
    return (this._rules);
  }

  set rules(value) {
    this._rules = value;
  }

  get roomInterval() {
    return (this._roomInterval);
  }

  set roomInterval(value) {
    this._roomInterval = value;
  }

  get owner() {
    return (this._owner);
  }

  set owner(value) {
    this._owner = value;
  }

  get arrivalOrder() {
    return (this._arrivalOrder);
  }

  set arrivalOrder(value) {
    this._arrivalOrder = value;
  }

  get roomInfo() {
    let ret = {};

    ret.url = this.url;
    ret.inGame = this.inGame;
    ret.nbPlayer = this.nbPlayer;
    ret.rules = this.rules;
    ret.listPlayers = this.listPlayers;
    ret.owner = this.owner;
    return (ret);
  }

  set roomInfo(value) {
    this._roomInfo = value;
  }

  get isOut() {
    return (this._isOut);
  }

  set isOut(value) {
    this._isOut = value;
  }

  get inGame() {
    return (this._inGame);
  }

  set inGame(value) {
    this._inGame = value;
  }

  get isPending() {
    return (this._isPending);
  }

  set isPending(value) {
    this._isPending = value;
  }

  getAllGames(only, exception) {
    let ret = {};
    let playersList = {};

    if (only !== undefined && this.listPlayers[only])
      return (this.listPlayers[only].game);
    else
      playersList = this.listPlayers;
    for (let [key, value] of Object.entries(playersList)) {
      if (key !== exception && key !== undefined)
        ret = { ...ret, [key]: value.game };
    }
    return (ret);
  }

  isOwner(id) {
    if (this._owner === id)
      return (true);
    return (false);
  }

  addSio(sio) {
    if (sio && sio.id)
      this.sioList = { ...this.sioList, [sio.id]: sio };
  }

  removeSio(id) {
    this.sioList = { ...this.sioList, [id]: undefined };
    delete this.sioList[id];
  }


  addOut(id) {
    this.isOut = { ...this.isOut, [id]: id };
    if (Object.keys(this.isOut).length >= this.nbPlayer - 1) {
      let winnerInfo = {};
      let winnerId;

      if (this.nbPlayer > 1) {
        for (let key of Object.keys(this.listPlayers)) {
          if (this.isOut[key] === undefined)
            winnerId = key;
        }
        winnerInfo = {
          name: String(this.listPlayers[winnerId].name),
          id: winnerId,
        };
      }
      
      this.isOut = {};
      this.endGame();
      this.emitAll('theEnd', undefined, { winnerInfo });
      setTimeout(() => {
        for (let player of Object.values(this.listPlayers))
          player.game = undefined;
      }, 1500);
    }
  }

  endGame(res) {
    clearInterval(this.roomInterval);
    this.isPending = true;
    this.roomInterval = undefined;
    this.inGame = undefined;
    setTimeout(() => {
      this.shapes = [];
      this.shapesId = [];
      this.inGame = false;
      if (res !== undefined)
        res();
    }, 1500);
  }

  resetUrl() {
    this.url = undefined;
  }

  addNewPlayer(clientId, profil) {
    let owner = false;

    if (this._nbPlayer === 0) {
      this.owner = clientId;
      owner = true;
    }
    profil = { ...profil, owner: owner };
    this.arrivalOrder.push(clientId);
    this.listPlayers = { ...this.listPlayers, [clientId]: new Player(profil, clientId, this) };
    this.nbPlayer++;
  }

  addReadyToStart(clientId) {
    this.readyToStart = { ...this.readyToStart, [clientId]: true };
  }

  addNewShape(shape) {
    this.shapes.push(shape);
  }

  addShapesId(id) {
    this.shapesId.push(id);
  }

  setAllGames(games) {
    for (let [id, client] of Object.entries(this.listPlayers))
      client.game = games[id];
  }

  resetReadyToStart() {
    this.readyToStart = undefined;
  }

  removePlayer(clientId) {
    this.nbPlayer--;
    if (this.owner === clientId) {
      if (this.nbPlayer > 0) {
        this.owner = this.arrivalOrder[1];
        this.listPlayers[this.owner].profil.owner = true;
      }
    }
    this.arrivalOrder.splice(this.arrivalOrder.indexOf(clientId), 1);
    if (this.isOut[clientId] !== undefined)
      delete this.isOut[clientId];
    delete this.listPlayers[clientId];
    delete this.sioList[clientId];
    this.emitAll('refreshRoomInfo', clientId, this.roomInfo);
  }

  launchGame() {
    initShapes(this);
    this.initGames();
    this.inGame = true;
    this.isPending = false;
    this.roomInterval = setInterval(this.gameLoop.bind(this), 1000, this.sioList, this.url);
    this.readyToStart = undefined;
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

    for (let [id, player] of Object.entries(this.listPlayers)) {
      if (id !== exception && player && player.game && player.game.spec) {
        ret.push({
          lines: _.cloneDeep(player.game.spec),
          name: player.name,
        });
      }
    }
    if (this.nbPlayer > 1 && ret) {
      if (hidden)
        retHidden = this.hiddenSpec(ret);
      return (retHidden);
    }
    return (ret);
  }

  initGames() {
    for (let player of Object.values(this.listPlayers)) {
      player.setNewGame(this.shapes, this.shapesId);
    }
  }

  flatGames(only) {
    let ret;

    if (only !== undefined) {
      ret = _.cloneDeep(this.getAllGames(only));
      if (!this.isOut[only])
        addTetri(ret);
      return (ret.formated);
    }
  }

  refreshAllVues(socketClients, exception) {
    for (let [id, client] of Object.entries(socketClients)) {
      if (this.inGame === true && id !== exception) {
        let flatGame = this.flatGames(id);
        client.emit('refreshVue', flatGame, this.createSpecList(id));
      }
    }
  }

  gameLoop(socketClients, url) {
    // let gamesTmp = _.cloneDeep(this.getAllGames());
    let gamesTmp = this.getAllGames();

    for (let id of Object.keys(socketClients)) {
      if (this.inGame === true && !this.isOut[id])
        gamesTmp[id] = refresh(gamesTmp[id], this, id);
    }
    if (this.inGame === true) {
      this.setAllGames(gamesTmp);
      this.refreshAllVues(socketClients);
    }
  }

  emitAll(message, except, obj, spec) {
    let clientList = this.sioList;

    for (let [id, client] of Object.entries(clientList)) {
      if (id !== except) {
        client.emit(message, obj, spec);
      }
    }
  }

  emitOnly(message, only, obj, spec) {
    let clientList = this.sioList;

    for (let [id, client] of Object.entries(clientList)) {
      if (id === only)
        client.emit(message, obj, spec);
    }
  }
};
