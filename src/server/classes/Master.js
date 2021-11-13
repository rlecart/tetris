import Room from './Room.js';
import mainServer from './Servers.js';
import { createNewUrl } from '../../misc/utils.js';
import { endGame } from '../refresh.js';

import _ from 'lodash';

export default class Master {
  constructor() {
    this._roomsList = {};
    this._sioClientList = {};
    this._server = {};
  }

  startServer() {
    return (new Promise((res) => {
      this.server = new mainServer(this);
      this.server.startServer(() => {
        this.server.listenSio(this);
        res();
      });
    }));
  }

  stopServer() {
    return (new Promise((res) => {
      this.server.stopListenSio(this.sioClientList);
      this.server.stopServer();
      this.server = undefined;
      res();
    }));
  }

  get server() {
    return (this._server);
  }

  set server(value) {
    this._server = value;
  }

  get roomsList() {
    return (this._roomsList);
  }

  set roomsList(value) {
    this._roomsList = value;
  }

  get sioClientList() {
    return (this._sioClientList);
  }

  set sioClientList(value) {
    this._sioClientList = value;
  }

  getSioHbeat(id) {
    if (this.sioClientList[id])
      return (this.sioClientList[id].hbeat);
  }

  getRoomFromPlayerId(id) {
    let room;

    if (id !== undefined) {
      for (let url in this.roomsList) {
        room = this.roomsList[url];
        if (room.listPlayers[id] !== undefined)
          return (room);
      }
    }
    return (undefined);
  }

  getSioListFromRoom(url) {
    let ret;
    let room;

    if ((room = this.roomsList[url]) && room.listPlayers) {
      for (let id of Object.keys(room.listPlayers))
        ret = { ...ret, [id]: this.sioClientList[id] };
    }
    return (ret);
  }

  isInRoom(clientId) {
    if (Object.keys(this.roomsList).length > 0) {
      for (let room of Object.values(this.roomsList)) {
        if (room.listPlayers[clientId] !== undefined)
          return (true);
      }
    }
    return (false);
  }

  addNewRoom(room) {
    this._roomsList = { ...this._roomsList, [room.url]: room };
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

  createRoom(clientId, profil, cb) {
    let room;

    if (profil && profil !== undefined && profil.name && profil.name !== undefined
      && profil.name.length > 0 && clientId !== undefined && clientId !== null) {
      if (this.isInRoom(clientId) && (room = this.getRoomFromPlayerId(clientId)))
        this.leaveRoom(clientId, room.url);
      room = new Room(this);
      room.url = createNewUrl(this.roomsList);
      this.addNewRoom(room);
      this.joinRoom(clientId, profil, room.url, cb);
    }
    else
      cb({ type: 'err', value: 'bad profil or clienId' });
  }

  joinRoom(clientId, profil, url, cb) {
    let room;

    if (profil && profil !== undefined && profil.name && profil.name !== undefined
      && profil.name.length > 0 && clientId !== undefined && clientId !== null) {
      if (this.isInRoom(clientId) && (room = this.getRoomFromPlayerId(clientId)))
        this.leaveRoom(clientId, room.url);
      if ((room = this.roomsList[url]) && room.inGame !== true && room.nbPlayer < 8) {
        profil = { ...profil, url: url };
        room.addNewPlayer(clientId, profil);
        room.addSio(this.sioClientList[clientId]);
        room.emitAll('refreshRoomInfo', clientId, room.roomInfo);
        cb({ type: 'ok', value: url });
      }
      else {
        cb({ type: 'err', value: 'room full or closed' });
      }
    }
    else
      cb({ type: 'err', value: 'bad profil or clienId' });
  }

  leaveRoom(clientId, url, cb) {
    let room;

    if ((room = this.roomsList[url]) && room.listPlayers[clientId]) {
      room.removePlayer(clientId);
      if (room.nbPlayer <= 0)
        this.closeRoom(room);
      cb({ type: 'ok' });
    }
    else
      cb({ type: 'err', value: 'cant find room or player not inside' });
  }

  closeRoom(room) {
    let url = room.url;
    let clientsRoom;

    if ((clientsRoom = this.getSioListFromRoom(url)) !== undefined) {
      for (let id of Object.keys(clientsRoom))
        room.removePlayer(id);
    }
    room.resetUrl();
    this._roomsList[url] = undefined;
    delete this._roomsList[url];
  }

  askToStartGame(clientId, url, cb) {
    let room = {};

    if ((room = this.roomsList[url]) && room.isOwner(clientId) && room.inGame === false) {
      room.emitAll('goToGame');
      cb({ type: 'ok' });
    }
    else
      cb({ type: 'err', value: 'room closed, not owner or already in game' });
  }

  askToEndGame(clientId, url, cb) {
    let room = {};

    if ((room = this.roomsList[url])) {
      endGame(room, clientId);
      cb({ type: 'ok' });
    }
    else
      cb({ type: 'err', value: 'cant find room' });
  }

  tryToStart(clientsRTS, nbPlayers) {
    let i = 0;

    for (let client in clientsRTS)
      i++;
    if (i === nbPlayers)
      return true;
    return false;
  }

  readyToStart(clientId, url, cb) {
    let room;

    if (url && clientId && (room = this.roomsList[url]) && room.listPlayers[clientId] && room.inGame === false && room.isPending) {
      room.addReadyToStart(clientId);
      if (this.tryToStart(room.readyToStart, room.nbPlayer))
        room.launchGame();
      cb({ type: 'ok' });
    }
    else if (room !== undefined && room.listPlayers[clientId] && !room.isPending)
      room.emitOnly('nowChillOutDude', clientId, `/${url}[${String(room.listPlayers[clientId].name)}]`);
    else
      cb({ type: 'err', value: 'bad url, bad clientId, cant find room, cant find player, room already in game or is pending' });

  }

  askToMove(clientId, url, dir, cb) {
    let room = {};
    let player = {};
    let game = {};

    if ((room = this.roomsList[url]) && room.inGame === true && (player = room.listPlayers[clientId])) {
      if ((game = player.game) && game.y !== -1)
        player.move(dir, room);
      cb({ type: 'ok' });
    }
    else
      cb({ type: 'err', value: 'room closed, in game or player not in room' });
  }

  askToGetRoomInfo(url, cb) {
    let room;

    if ((room = this.roomsList[url]))
      cb({ type: 'ok', value: room.roomInfo });
    else
      cb({ type: 'err', value: 'cant find room' });
  }

  askEverybodyToCalmDown(clientId, url, cb) {
    let room = this.roomsList[url];

    if (room && room.owner === clientId) {
      for (let [id, client] of Object.entries(room.sioList)) {
        client.emit('nowChillOutDude', `/${url}[${String(room.listPlayers[id].name)}]`);
      }
      room.isPending = true;
      cb({ type: 'ok' });
    }
    else
      cb({ type: 'err', value: 'cant find room or not owner' });
  }

  heartbeat(client) {
    this.setSioHbeat(client.id, Date.now());
    setTimeout(() => {
      let now = Date.now();

      if (now - this.getSioHbeat(client.id) > 5000) {
        // console.log('this client id will be closed ' + client.id);
        let room = this.getRoomFromPlayerId(client.id, this);
        if (room !== undefined)
          this.leaveRoom(client.id, room.url, () => { });
        setTimeout(() => this.removeSio(client), 500);
      }
      now = null;
    }, 6000);
  }
};