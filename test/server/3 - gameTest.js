import { expect } from 'chai';
import _ from 'lodash';

import { addNewClients, waitAMinute } from '../helpers/helpers.js';
import Master from '../../src/server/classes/Master.js';
import api from '../../src/client/api/clientApi.js';

describe('Game Tests', () => {
  const cb = () => { };
  const players = [
    { name: 'Hector' },
    { name: '\t\n\r\v\f' },
    { name: 'pouayayay' },
    { name: 'ahbahtiens' },
  ];
  let nbPlayer = 4;
  let master;
  let room = {};
  let sockets;
  let wasAskedToGoToGame = false;

  before((done) => {
    master = new Master();
    master.startServer();
    sockets = addNewClients(nbPlayer, done, { 'goToGame': () => { wasAskedToGoToGame = true; } });
  });

  after(() => {
    master.stopServer();
  });

  describe('Launch/Start game', () => {
    before(() => {
      master.createRoom(sockets[0].id, players[0], cb);
      room = master.getRoomFromPlayerId(sockets[0].id, master);
      master.joinRoom(sockets[1].id, players[1], room.url, cb);
      master.joinRoom(sockets[2].id, players[2], room.url, cb);
      master.joinRoom(sockets[3].id, players[3], room.url, cb);
    });

    it('Shouldn\'t goToGame (bad rights)', async () => {
      for (let i = 1; i < room.nbPlayer; i++) {
        await api.askToStartGame(sockets[i], room.url);
        expect(wasAskedToGoToGame).to.be.false;
      }
    });

    it('Should goToGame (room\'s admin asked for)', async () => {
      await api.askToStartGame(sockets[0], room.url);
      await waitAMinute(200); // wait 'goToGame' reponse
      expect(wasAskedToGoToGame).to.be.true;
    });

    it('Shouldn\'t launch game (not enough players RTS)', async () => {
      await api.readyToStart(sockets[0], room.url);
      expect(room.inGame).to.be.false;
    });

    it('Should launch game (every players RTS)', async () => {
      await api.readyToStart(sockets[1], room.url);
      await api.readyToStart(sockets[2], room.url);
      await api.readyToStart(sockets[3], room.url);
      expect(room.roomInterval).to.not.be.undefined;
      clearInterval(room.roomInterval);
      expect(room.inGame).to.be.true;
    });
  });

  describe('GameLoop/Refresh', () => {
    let gamesCpy;

    beforeEach(() => {
      gamesCpy = _.cloneDeep(room.getAllGames());
    });

    it('Should gameLoop init values', () => {
      room.gameLoop(master.getSioListFromRoom(room.url), room.url);
      expect(room.getAllGames()).to.not.be.eql(gamesCpy);
    });

    it('Y should be +1 for every clients', () => {
      room.gameLoop(master.getSioListFromRoom(room.url), room.url);
      for (let [key, value] of Object.entries(gamesCpy))
        expect(room.getAllGames(key).tetri.y).to.be.eql(value.tetri.y + 1);
    });

    it('Api should move right', async () => {
      for (let [key, value] of Object.entries(gamesCpy)) {
        await api.move('right', room.url, sockets.find(socket => socket.id === key));
        expect(room.getAllGames(key).tetri.x).to.be.eql(value.tetri.x + 1);
      }
    });

    it('Api should move left', async () => {
      for (let [key, value] of Object.entries(gamesCpy)) {
        await api.move('left', room.url, sockets.find(socket => socket.id === key));
        expect(room.getAllGames(key).tetri.x).to.be.eql(value.tetri.x - 1);
      }
    });

    it('Api should turn', async () => {
      for (let [key, value] of Object.entries(gamesCpy)) {
        await api.move('turn', room.url, sockets.find(socket => socket.id === key));
        if (room.getAllGames(key).tetri.id === 5)
          expect(room.getAllGames(key).tetri.actualShape).to.be.eql(value.tetri.actualShape);
        else
          expect(room.getAllGames(key).tetri.actualShape).to.not.be.eql(value.tetri.actualShape);
      }
    });

    it('Api should stash', async () => {
      let isSquare = 0;

      for (let [key, value] of Object.entries(gamesCpy)) {
        isSquare = value.tetri.id === 5 ? 1 : 0;
        await api.move('stash', room.url, sockets.find(socket => socket.id === key));
        expect(room.getAllGames(key).tetri.y).to.not.be.eql(value.tetri.y);
        expect(room.getAllGames(key).tetri.y).to.be.eql(20 - room.getAllGames(key).tetri.actualShape.length + isSquare);
      }
    });

    it('Api should do nothing', async () => {
      for (let [key, value] of Object.entries(gamesCpy)) {
        await api.move('somethingThatDoesntExist', room.url, sockets.find(socket => socket.id === key));
        expect(room.getAllGames(key)).to.be.eql(gamesCpy[key]);
      }
    });

    it('Api should endGame', async () => {
      for (let i in sockets)
        api.askToEndGame(sockets[i], room.url);
      await waitAMinute(500);
      expect(room.inGame).to.satisfy((value) => {
        if (value === false || (value === undefined && room.isPending === true))
          return (true);
        else
          return (false);
      });
    });
  });

  describe('Api next functions', () => {
    let newSockets;

    before((done) => {
      newSockets = addNewClients(nbPlayer, done);
    });

    it('Api get roomInfo', async () => {
      let infoToTest;

      await api.getRoomInfo(sockets[0], room.url)
        .then((roomInfo) => { infoToTest = roomInfo; });
      expect(infoToTest).to.not.be.undefined;
    });

    it('Api createRoom', async () => {
      await api.createRoom(newSockets[0], { name: 'benjam1' });
      room = master.getRoomFromPlayerId(newSockets[0].id, master);
      expect(room).to.not.be.undefined;
    });

    it('Api joinRoom', async () => {
      await api.joinRoom(newSockets[1], { name: 'benjam2' }, room.url);
      expect(master.getRoomFromPlayerId(newSockets[1].id, master)).to.not.be.undefined;
    });

    it('Api leaveRoom', async () => {
      await api.leaveRoom(newSockets[1], room.url);
      expect(master.getRoomFromPlayerId(newSockets[1].id, master)).to.be.undefined;
    });

    it('Api askEverybodyToCalmDown', async () => {
      let haveBeenCalled = false;
      newSockets[0].on('nowChillOutDude', () => haveBeenCalled = true);
      await api.askEverybodyToCalmDown(newSockets[0], room.url);
      expect(haveBeenCalled).to.be.true;
    });
  });
});
