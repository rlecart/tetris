// let Master = require('../server/classes/Master.js')
let master = require('../server/server')
let { expect, assert } = require('chai')
let openSocket = require('socket.io-client')

describe('Server tests', () => {
  let server
  before(() => {
    // master = new Master()
    // master.startServer()
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
    before(() => {
      socket = openSocket.connect('http://localhost:8000')

    })

    it('Socket connection ok', () => {
      console.log('bwoenbowei\n\n')
      console.log(master.getSioList())
      console.log('bwoenbowei\n\n')
    })

    after(() => {
      socket.disconnect()
    })
  })

  after(() => {
    master.stopServer()
    // setTimeout(() => { master.stopServer() }, 5000)
  })
})