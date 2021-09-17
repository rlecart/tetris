let { getRoomFromPlayerId } = require('./utils.js');
let openSocket = require('socket.io-client');
let { expect, should } = require('chai')
let _ = require('lodash')
let api = require('../src/api/clientApi')
let Master = require('../server/classes/Master')

describe.skip('Game behviour', () => {
  let server
  let master

  before(() => {
    master = new Master()
    master.startServer()
    server = master.getServer()
  })

  after(() => {
    master.stopServer()
  })


  beforeEach((done) => {
    socket.on('connect', () => {
      var player = { name: 'Belle partie' }
      master.createRoom(socket.id, player, cb);
      room = getRoomFromPlayerId(socket.id, master)
      master.readyToStart(socket.id, room.getUrl())
      clearInterval(room.getInterval())
      room.gameLoop(master.getSioListFromRoom(room.getUrl(), true), room.getUrl())
      room.gameLoop(master.getSioListFromRoom(room.getUrl(), true), room.getUrl())
      console.log('ouioui')
      done()
    })
  })

  var cb = () => { console.log('Callback') };

  it('Hooks should works', () => {
    let gameToCompare = _.cloneDeep(room.getAllGames(socket.id))

      // console.log(socket.server.sockets.sockets)
    // console.log(room.getAllGames(socket.id))
    socket.emit('move', socket.id, room.getUrl(), 'right') // le socket fonctionne, juste ca multiple socket jsp pq

    api.move('right', room.getUrl(), socket)
    console.log(room.getAllGames(socket.id))
    for (let [key, value] of Object.entries(master.getSioList()))
      console.log(key)
    console.log(master.getSioList())
    expect(room.getAllGames(master.getNique().id)).to.not.eql(gameToCompare)
    expect(room.getAllGames(socket.id)).to.not.eql(gameToCompare)
  })

})