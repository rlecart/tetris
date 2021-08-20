// let Master = require('../server/classes/Master.js')
let { expect, assert } = require('chai')
let openSocket = require('socket.io-client')

describe('Server tests', () => {
  let server
  before(() => {
    let master = require('../server/server')
    // master = new Master()
    // master.startServer()
    master.startServer()
    server = master.getServer()
  })
  beforeEach(() => {
    this.props.master = master
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
      console.log(this.props)
      // console.log(master.getSioList())
    })

    it('Socket connection ok', () => {
      // console.log('bwoenbowei\n\n')
      // console.log(master.getSioList())
      // console.log('bwoenbowei\n\n')
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