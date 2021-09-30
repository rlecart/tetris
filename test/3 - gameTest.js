let { expect } = require('chai')
const _ = require('lodash')

let { getRoomFromPlayerId, addNewClients, waitAMinute } = require('./utils.js');
let Master = require('../server/classes/Master.js')
let api = require('../src/api/clientApi');

describe('Game Tests', () => {
  const cb = () => { };
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
        await api.askToStartGame(sockets[i], room.getUrl());
        expect(wasAskedToGoToGame).to.be.false;
      }
    });

    it('Should goToGame (room\'s admin asked for)', async () => {
      // console.log(sockets[0])
      await api.askToStartGame(sockets[0], room.getUrl());
      await waitAMinute(200) // reponse avec la requete 'goToGame'
      expect(wasAskedToGoToGame).to.be.true;
    });

    it('Shouldn\'t launch game (not enough players RTS)', async () => {
      await api.readyToStart(sockets[0], room.getUrl())
      expect(room.isInGame()).to.be.false
    })

    it('Should launch game (every players RTS)', async () => {
      await api.readyToStart(sockets[1], room.getUrl())
      await api.readyToStart(sockets[2], room.getUrl())
      await api.readyToStart(sockets[3], room.getUrl())
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
        await api.move('right', room.getUrl(), sockets.find(socket => socket.id === key));
        expect(room.getAllGames(key).getX()).to.be.eql(value.getX() + 1);
      }
    })

    it('Api should move left', async () => {
      for (let [key, value] of Object.entries(gamesCpy)) {
        await api.move('left', room.getUrl(), sockets.find(socket => socket.id === key));
        expect(room.getAllGames(key).getX()).to.be.eql(value.getX() - 1);
      }
    })

    it('Api should turn', async () => {
      for (let [key, value] of Object.entries(gamesCpy)) {
        await api.move('turn', room.getUrl(), sockets.find(socket => socket.id === key));
        if (room.getAllGames(key).getId() === 5)
          expect(room.getAllGames(key).getActualShape()).to.be.eql(value.getActualShape());
        else
          expect(room.getAllGames(key).getActualShape()).to.not.be.eql(value.getActualShape());
      }
    })

    it('Api should stash', async () => {
      let isSquare = 0

      for (let [key, value] of Object.entries(gamesCpy)) {
        isSquare = value.getId() === 5 ? 1 : 0
        await api.move('stash', room.getUrl(), sockets.find(socket => socket.id === key));
        expect(room.getAllGames(key).getY()).to.not.be.eql(value.getY());
        expect(room.getAllGames(key).getY()).to.be.eql(20 - room.getAllGames(key).getActualShape().length + isSquare);
      }
    })

    it('Api should do nothing', async () => {
      for (let [key, value] of Object.entries(gamesCpy)) {
        await api.move('somethingThatDoesntExist', room.getUrl(), sockets.find(socket => socket.id === key));
        expect(room.getAllGames(key)).to.be.eql(gamesCpy[key]);
      }
    })

    it('Api should endGame', async () => {
      for (let i in sockets)
        api.askToEndGame(sockets[i], room.getUrl());
      await waitAMinute(500)
      expect(room.isInGame()).to.satisfy((value) => {
        if (value === false || (value === undefined && room.isPending() === true))
          return (true)
        else
          return (false)
      })
      // expect(room.isInGame()).to.be.eql(false);
    })
  })

  describe('Api next functions', () => {
    let newSockets

    before((done) => {
      newSockets = addNewClients(nbPlayer, done);
    })

    it('Api get roomInfo', async () => {
      let infoToTest

      await api.getRoomInfo(sockets[0], room.getUrl())
        .then((roomInfo) => { infoToTest = roomInfo })
      expect(infoToTest).to.not.be.undefined
    })

    it('Api createRoom', async () => {
      await api.createRoom(newSockets[0], { name: 'benjam1' });
      room = getRoomFromPlayerId(newSockets[0].id, master)
      expect(room).to.not.be.undefined;
    })

    it('Api joinRoom', async () => {
      await api.joinRoom(newSockets[1], { name: 'benjam2' }, room.getUrl());
      expect(getRoomFromPlayerId(newSockets[1].id, master)).to.not.be.undefined;
    })

    it('Api leaveRoom', async () => {
      await api.leaveRoom(newSockets[1], room.getUrl());
      expect(getRoomFromPlayerId(newSockets[1].id, master)).to.be.undefined;
    })
  })
})
