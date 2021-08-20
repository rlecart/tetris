import Master from '../server/classes/Master.mjs'
import { expect, assert } from 'chai';
import openSocket from 'socket.io-client'

describe('Server tests', () => {
  let master
  let server
  before(() => {
    master = new Master()
    master.startServer()
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
    setTimeout(() => { master.stopServer() }, 5000)
  })
})