let { expect } = require('chai')
const _ = require('lodash')

let { getRoomFromPlayerId, addNewClients, waitAMinute } = require('./utils.js');
let Master = require('../server/classes/Master.js')
let api = require('../src/api/clientApi');

describe('Game Tests', () => {
  const cb = () => { console.log('Callback') };
  const players = [
    { name: 'Hector' },
    { name: '\t\n\r\v\f' },
    { name: 'pouayayay' },
    { name: 'ahbahtiens' },
  ];
  let nbPlayer = 4
  let master;
  let room = {};
  let sockets;
  let wasAskedToGoToGame = false;

  before((done) => {
    master = new Master();
    master.startServer();
    sockets = addNewClients(nbPlayer, done, { 'goToGame': () => { wasAskedToGoToGame = true; } });
    // sockets.forEach(socket => socket.on('goToGame', ));
  })

  after(() => {
    master.stopServer()
  })

  describe('Launch/Start game', () => {
    before(() => {
      master.createRoom(sockets[0].id, players[0], cb);
      room = getRoomFromPlayerId(sockets[0].id, master);
      master.joinRoom(sockets[1].id, players[1], room.getUrl(), cb);
      master.joinRoom(sockets[2].id, players[2], room.getUrl(), cb);
      master.joinRoom(sockets[3].id, players[3], room.getUrl(), cb);
    });

    it('Shouldn\'t goToGame (bad rights)', async () => {
      for (let i = 1; i < room.getNbPlayer(); i++) {
        api.askToStartGame(sockets[i], room.getUrl());
        await waitAMinute(300);
        expect(wasAskedToGoToGame).to.be.false;
      }
    });

    it('Should goToGame (room\'s admin asked for)', async () => {
      // console.log(sockets[0])
      api.askToStartGame(sockets[0], room.getUrl());
      await waitAMinute(300);
      expect(wasAskedToGoToGame).to.be.true;
    });

    it('Shouldn\'t launch game (not enough players RTS)', async () => {
      master.readyToStart(sockets[0].id, room.getUrl())
      await waitAMinute(300);
      expect(room.isInGame()).to.be.false
    })

    it('Should launch game (every players RTS)', async () => {
      master.readyToStart(sockets[1].id, room.getUrl())
      master.readyToStart(sockets[2].id, room.getUrl())
      master.readyToStart(sockets[3].id, room.getUrl())
      await waitAMinute(300)
      expect(room.getInterval()).to.not.be.undefined
      clearInterval(room.getInterval())
      expect(room.isInGame()).to.be.true
    })
  });

  describe('GameLoop/Refresh', () => {
    let gamesCpy

    beforeEach(() => {
      gamesCpy = _.cloneDeep(room.getAllGames())
    })

    it('Should gameLoop init values', () => {
      room.gameLoop(master.getSioListFromRoom(room.getUrl(), true), room.getUrl())
      expect(room.getAllGames()).to.not.be.eql(gamesCpy)
    })

    it('Y should be +1 for every clients', () => {
      room.gameLoop(master.getSioListFromRoom(room.getUrl(), true), room.getUrl())
      for (let [key, value] of Object.entries(gamesCpy))
        expect(room.getAllGames(key).getY()).to.be.eql(value.getY() + 1)
    })

    it('Api should move right', async () => {
      for (let [key, value] of Object.entries(gamesCpy)) {
        api.move('right', room.getUrl(), sockets.find(socket => socket.id === key));
        await waitAMinute(200)
        expect(room.getAllGames(key).getX()).to.be.eql(value.getX() + 1);
      }
    })

    it('Api should move left', async () => {
      for (let [key, value] of Object.entries(gamesCpy)) {
        api.move('left', room.getUrl(), sockets.find(socket => socket.id === key));
        await waitAMinute(200)
        expect(room.getAllGames(key).getX()).to.be.eql(value.getX() - 1);
      }
    })

    it ('', () => {

    })

  })
})
