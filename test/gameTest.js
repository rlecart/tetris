let { expect } = require('chai')

let askToStartGame = require('../server/classes/Master.js')
let { getGameFromPlayerId } = require('./utils.js');
let openSocket = require('socket.io-client');

describe('Game Tests', () => {

  before(() => {
    master = require('../server/server')
    server = master.getServer()

    let room = {};
    let sock = undefined;
  })

  var cb = () => { console.log('Callback') };

  describe('[??? ???]', () => {

    before((done) => {
      socket = new openSocket('http://localhost:8000')
      server.getIoServer().on('connection', (socketnique) => {
        socket = socketnique
      })
      socket.on('connect', done)
    })

    it('Devrait lancer la partie (1 joueur)', () => {
      var player = { name : 'Belle partie' }
      master.createRoom(socket.id, player, cb);
      room = getGameFromPlayerId(socket.id, master)

      master.readyToStart(socket.id, room.getUrl())
      clearInterval(room.getInterval())
      room.gameLoop(master.getSioListFromRoom(room.getUrl(), true), room.getUrl())
      // console.log(room)
		});

  });

  after(() => {
		//master.getServer().getIoServer().disconnect()
		socket.disconnect()
	})

})
