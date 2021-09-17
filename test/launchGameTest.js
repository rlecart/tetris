let { expect } = require('chai')

let askToStartGame = require('../server/classes/Master.js')
let { getRoomFromPlayerId } = require('./utils.js');
let openSocket = require('socket.io-client');
let Master = require('../server/classes/Master.js')

describe('Launch Game Tests', () => {
  let master;
  let server;

  before(() => {
    master = new Master()
    master.startServer()
    server = master.getServer()

    let room = {};
    let sock = undefined;
  })

  after(() => {
    master.stopServer()
		//master.getServer().getIoServer().disconnect()

	})

  var cb = () => { console.log('Callback') };
  var i = 0

  describe('[START GAME]', () => {

    // while (i < 1) {
    //   sockets[i] = new openSocket('http://localhost:8000')
    //   server.getIoServer().on('connection', (data) => {
    //     sockets[i] = data;
    //   });
    //   sockets[i].on('connect joueur ' + i, done);
    //   ++i;
    // }
    // })


    before((done) => {
      sockets = []
      while (i < 4) {
        sockets[i] = new openSocket('http://localhost:8000')
        server.getIoServer().on('connection', (data) => {
          sockets[i] = data
        })
        ++i;
      }
      sockets[i - 1].on('connect', done)
    })

    it('Devrait lancer la partie (1 joueur)', () => {
      var player = { name : 'Belle partie' }
      master.createRoom(sockets[0].id, player, cb);
      room = getRoomFromPlayerId(sockets[0].id, master)
      master.readyToStart(sockets[0].id, room.getUrl())
      clearInterval(room.getInterval())
      room.gameLoop(master.getSioListFromRoom(room.getUrl(), true), room.getUrl())
      expect(room._inGame).to.be.eql(true);
		});

    it('Devrait finir la partie (4 joueurs)', () => {
      var players = [ { name : 'j1' }, { name : 'j2' }, { name : 'j3' }, { name : 'j4' } ]
      master.createRoom(sockets[0].id, players[0], cb);
      room = getRoomFromPlayerId(sockets[0].id, master);
      master.joinRoom(sockets[1], players[1], room.getUrl());
      master.joinRoom(sockets[2], players[2], room.getUrl());
      master.joinRoom(sockets[3], players[3], room.getUrl());
      master.readyToStart(sockets[0].id, room.getUrl())
      expect(room._inGame).to.be.eql(true);
      clearInterval(room.getInterval())
      var fastEnd = 0
      while (fastEnd++ < 500) {
        room.gameLoop(master.getSioListFromRoom(room.getUrl(), true), room.getUrl())
      }
      expect(room._inGame).to.be.eql(false);

		});


  });

})
