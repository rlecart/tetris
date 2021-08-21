let { getRoomFromPlayerId } = require('./utils.js');
let openSocket = require('socket.io-client');
let { expect, should } = require('chai')
let _ = require('lodash')
let api = require('../src/api/clientApi')

describe('Game behviour', () => {
  let master
  let server
  let room

  before((done) => {
    master = require('../server/server')
    server = master.getServer()
    socket = new openSocket('http://localhost:8000')
    server.getIoServer().on('connection', (socketnique) => {
      socket = socketnique
    })
    socket.on('connect', () => {
      var player = { name: 'Belle partie' }
      master.createRoom(socket.id, player, cb);
      room = getRoomFromPlayerId(socket.id, master)
      master.readyToStart(socket.id, room.getUrl())
      clearInterval(room.getInterval())
      room.gameLoop(master.getSioListFromRoom(room.getUrl(), true), room.getUrl())
      done()
    })
  })

  var cb = () => { console.log('Callback') };

  it('Hooks should works', () => {
    let gameToCompare = _.cloneDeep(room.getAllGames(socket.id))

      // console.log(socket.server.sockets.sockets)
      socket.emit('move', socket.id, idRoom, 'right')
    // api.move('right', room.getUrl(), socket)
    // console.log(room.getAllGames(socket.id))
    expect(room.getAllGames(socket.id)).to.not.eql(gameToCompare)
  })

  after(() => {
    // master.stopServer()
  })
})