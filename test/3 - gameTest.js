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
    it('Should gameLoop refresh values x1', () => {
      let gamesCpy = _.cloneDeep(room.getAllGames())

      console.log(room.getAllGames())
      room.gameLoop(master.getSioListFromRoom(room.getUrl(), true), room.getUrl())
      console.log(room.getAllGames())
      expect(room.getAllGames()).to.not.be.eql(gamesCpy)
      expect(room)
    })
    const expectGameLoopToBeRefreshed = (gamesCpy, games, room) => {
      for (let [key, value] of Object.entries(games)) {
        if (value.getTetri().id !== gamesCpy[key].getTetri().id) // ici faire toutes les verifs d'actualisation de refresh (mettre sur papier pour meilleure visu ?)
        ;
      }
      return (true)
    }

    // it('Should gameLoop ')
  })

  // it('Devrait lancer la partie (1 joueur)', () => {
  //   master.readyToStart(sockets[0].id, room.getUrl())
  //   clearInterval(room.getInterval())
  //   room.gameLoop(master.getSioListFromRoom(room.getUrl(), true), room.getUrl())
  //   expect(room._inGame).to.be.eql(true);
  // });

  // it('Devrait finir la partie (4 joueurs)', () => {
  //   var players = [{ name: 'j1' }, { name: 'j2' }, { name: 'j3' }, { name: 'j4' }]
  //   master.createRoom(sockets[0].id, players[0], cb);
  //   room = getRoomFromPlayerId(sockets[0].id, master);
  //   master.joinRoom(sockets[1], players[1], room.getUrl());
  //   master.joinRoom(sockets[2], players[2], room.getUrl());
  //   master.joinRoom(sockets[3], players[3], room.getUrl());
  //   master.readyToStart(sockets[0].id, room.getUrl())
  //   expect(room._inGame).to.be.eql(true);
  //   clearInterval(room.getInterval())
  //   var fastEnd = 0
  //   while (fastEnd++ < 500) {
  //     room.gameLoop(master.getSioListFromRoom(room.getUrl(), true), room.getUrl())
  //   }
  //   expect(room._inGame).to.be.eql(false);

  // });



})
