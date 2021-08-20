let master = require('../server/server')
let { expect } = require('chai')

let askToStartGame = require('../server/classes/Master.js')
let { getGameFromPlayerId } = require('./utils.js');
let openSocket = require('socket.io-client'
);

describe('Game Tests', () => {

  var cb = () => { console.log('Callback') };
  let room = {};
  let sock = undefined;

  before((done) => {
    return (new Promise((resolve) => {
      sock = openSocket('http://localhost:8000')
      setTimeout(() => {
        resolve();

      }, 3000)
    }))
	})

  describe('[??? ???]', () => {

    it('Devrait lancer la partie (1 joueur)', () => {
      var player = { name : 'Belle partie' }
      var playerId = 203
      master.createRoom(playerId, player, cb);
      room = getGameFromPlayerId(playerId, master)
      master.askToStartGame(playerId, player, room.getUrl())
      console.log(master.getSioList())
		});

  });

  after(() => {
		//master.getServer().getIoServer().disconnect()
		master.stopServer()
	})

})
