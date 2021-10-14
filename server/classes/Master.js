let Room = require('./Room.js');
let mainServer = require('./Servers.js');
let { createNewUrl } = require('../../src/misc/utils.js');
let { endGame } = require('../refresh.js');

let _ = require('lodash');

module.exports = class Master {
  constructor() {
    this._roomsList = {};
    this._sioClientList = {};
    this._server = {};
  }

  startServer() {
    this._server = new mainServer(this);
    this._server.startServer();
    this._server.listenSio(this);
    // console.log('[Server completely started]')
  }

  stopServer() {
    this._server.stopListenSio(this._sioClientList);
    this._server.stopServer();
    this._server = undefined;
    // console.log('[Server completely stopped]')
  }

  getServer() {
    return (this._server);
  }

  getRoomsList() {
    return (this._roomsList);
  }

  getRoom(url) {
    if (url !== undefined && this._roomsList !== undefined && this._roomsList[url] !== undefined)
      return (this._roomsList[url]);
  }

  getSioList(only) {
    if (only !== undefined)
      return (this._sioClientList[only]);
    return (this._sioClientList);
  }

  getSioHbeat(id) {
    return (this._sioClientList[id].hbeat);
  }

  getRoomFromPlayerId(id) {
    let room;

    if (id !== undefined) {
      for (let url in this.getRoomsList()) {
        room = this.getRoom(url);
        if (room.getListPlayers(id) !== undefined)
          return (room);
      }
    }
    return (undefined);
  }

  getSioListFromRoom(url) {
    let ret;
    let room;

    if ((room = this.getRoom(url)) && room.getListPlayers()) {
      for (let id of Object.keys(room.getListPlayers()))
        ret = { ...ret, [id]: this.getSioList(id) };
    }
    return (ret);
  }

  isInRoom(clientId) {
    if (Object.keys(this.getRoomsList()).length > 0) {
      for (let room of Object.values(this.getRoomsList())) {
        if (room.getListPlayers(clientId) !== undefined)
          return (true);
      }
    }
    return (false);
  }

  addNewRoom(room) {
    this._roomsList = { ...this._roomsList, [room.getUrl()]: room };
  }

  setSioHbeat(id, value) {
    this._sioClientList[id].hbeat = value;
  }

  addNewSio(client) {
    this._sioClientList = { ...this._sioClientList, [client.id]: client };
  }

  removeSio(client) {
    if (this._sioClientList[client] !== undefined) {
      this._sioClientList[client].disconnect();
      delete this._sioClientList[client];
    }
  }

  createRoom(clientId, profil, res) {
    let room;

    if (profil && profil !== undefined && profil.name && profil.name !== undefined && profil.name.length > 0 && clientId !== undefined && clientId !== null) {
      if (this.isInRoom(clientId) && (room = this.getRoomFromPlayerId(clientId)))
        this.leaveRoom(clientId, room.getUrl());
      room = new Room(this);
      room.setUrl(createNewUrl(this.getRoomsList()));
      this.addNewRoom(room);
      this.joinRoom(clientId, profil, room.getUrl(), res);
    }
  }

  joinRoom(clientId, profil, url, cb) {
    let room;

    if (profil && profil !== undefined && profil.name) {
      if (this.isInRoom(clientId) && (room = this.getRoomFromPlayerId(clientId)))
        this.leaveRoom(clientId, room.getUrl());
      if ((room = this.getRoom(url)) && room.isInGame() !== true && room.getNbPlayer() < 8) {
        profil = { ...profil, url: url };
        room.addNewPlayer(clientId, profil);
        room.addSio(this.getSioList(clientId));
        room.emitAll('refreshRoomInfo', clientId, room.getRoomInfo());
        cb({ type: 'ok', value: url });
      }
      else
        cb({ type: 'err', value: 'room full' });
    }
  }

  leaveRoom(clientId, url, res) {
    let room;

    if ((room = this.getRoom(url)) && room.getListPlayers(clientId)) {
      room.removePlayer(clientId);
      if (room.getNbPlayer() <= 0) {
        this.closeRoom(room);
      }
      if (res !== undefined)
        res();
    }
  }

  closeRoom(room) {
    let url = room.getUrl();
    let clientsRoom;

    if ((clientsRoom = this.getSioListFromRoom(url)) !== undefined) {
      for (let id of Object.keys(clientsRoom))
        room.removePlayer(id);
    }
    room.resetUrl();
    this._roomsList[url] = undefined;
    delete this._roomsList[url];
  }

  askToStartGame(clientId, url, res) {
    let room = {};

    if ((room = this.getRoom(url)) && room.isOwner(clientId) && room.isInGame() === false)
      room.emitAll('goToGame');
    if (res !== undefined)
      res();
  }

  askToEndGame(clientId, url, res) {
    let room = {};

    if ((room = this.getRoom(url)))
      endGame(room, clientId, res);
    if (res !== undefined)
      res();
  }

  tryToStart(clientsRTS, nbPlayers) {
    let i = 0;

    for (let client in clientsRTS)
      i++;
    if (i === nbPlayers)
      return true;
    return false;
  }

  readyToStart(clientId, url, res) {
    let room;

    if (url && clientId && (room = this.getRoom(url)) && room.getListPlayers(clientId) && room.isInGame() === false && room.isPending()) {
      room.addReadyToStart(clientId);
      if (this.tryToStart(room.getReadyToStart(), room.getNbPlayer())) {
        room.launchGame(this.getSioListFromRoom(url));
      }
      if (res !== undefined)
        res();
    }
    else if (room !== undefined && room.getListPlayers(clientId) && !room.isPending())
      room.emitOnly('nowChillOutDude', clientId, `/${url}[${String(room.getListPlayers(clientId).getName())}]`);
  }

  askToMove(clientId, url, dir, res) {
    let room = {};
    let player = {};
    let game = {};

    if ((room = this.getRoom(url)) && (player = room.getListPlayers(clientId))) {
      if ((game = player.getGame()) && game.getY() !== -1)
        player.move(dir, room);
      if (res !== undefined)
        res();
    }
  }

  askEverybodyToCalmDown(clientId, url, res) {
    let room = {};
    let sioList = {};

    if ((room = this.getRoom(url)) && room.getOwner() === clientId && (sioList = room.getSio())) {
      for (let [id, client] of Object.entries(sioList)) {
        client.emit('nowChillOutDude', `/${url}[${String(room.getListPlayers(id).getName())}]`);
      }
      room.setPending(true);
      if (res !== undefined)
        res();
    }
  }
};