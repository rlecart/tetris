let { expect, assert } = require('chai')
let openSocket = require('socket.io-client')

describe('Server tests', () => {
  let server
  let master

  before(() => {
    master = require('../server/server')
    server = master.getServer()
  })

  describe('Server init', () => {
    it('Server obj should exists', () => {
      assert.exists(server)
    })
    it('Http server should exists', () => {
      assert.exists(server.getHttpServer())
    })
    it('Io server should exists', () => {
      assert.exists(server.getIoServer())
    })
  })

  describe('With client', () => {
    let socket

    before((done) => {
      socket = new openSocket('http://localhost:8000')
      server.getIoServer().on('connection', (socketnique) => {
        socket = socketnique
      })
      socket.on('connect', done)
    })

    it('Socket connection ok', () => {
      assert.exists(master.getSioList())
      // console.log(socket.id)
      // console.log(server.getIoServer().sockets.sockets)
    })

    after(() => {
      socket.disconnect()
    })
  })

  after(() => {
    // master.stopServer()
  })
})