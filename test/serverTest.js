let { expect, assert } = require('chai')
let openSocket = require('socket.io-client')
let Master = require('../server/classes/Master.js')

describe.only('Server tests', () => {
  let server
  let master

  before((done) => {
    master = new Master()
    master.startServer()
    server = master.getServer()
    done()
  })

  after((done) => {
    master.stopServer()
    done()
  })

  // beforeEach(() => {
  //   socket = new openSocket('http://localhost:8000')
  // })

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
    let sockets = []

    before((done) => {
      sockets.push(new openSocket('http://localhost:8000'))
      done()
    })

    after((done) => {
      sockets.forEach(socket => socket.disconnect())
      done()
    })

    it('Socket connection ok', () => {
      assert.exists(master.getSioList())
    })

  })

})
