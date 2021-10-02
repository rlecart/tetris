let { expect, assert } = require('chai');
let Master = require('../server/classes/Master.js');
const { addNewClients, removeEveryClients, waitAMinute } = require('./helpers/helper.js');

describe('Server tests', () => {
  let server;
  let master;

  before(() => {
    master = new Master();
    master.startServer();
    server = master.getServer();
  });

  after(() => {
    master.stopServer();
  });

  describe('Server init', () => {
    it('Server obj should exists', () => {
      assert.exists(server);
    });
    it('Http server should exists', () => {
      assert.exists(server.getHttpServer());
    });
    it('Io server should exists', () => {
      assert.exists(server.getIoServer());
    });
  });


  describe('With client', () => {
    let sockets = [];

    before((done) => {
      sockets = addNewClients(1, done);
    });

    after(async () => {
      await removeEveryClients(master);
      expect(Object.keys(master.getSioList()).length).to.be.eql(0);
      // sockets.forEach(socket => master.removeSio(socket.id))
    });

    it('Socket list exists', () => {
      assert.exists(master.getSioList());
    });
    it('Socket list nicely filled', () => {
      expect(Object.keys(master.getSioList()).length).to.be.eql(1);
    });
    it('Emit test with ping', (done) => {
      sockets[0].on('pong', done);
      sockets[0].emit('ping');
    });
    it('Remove client', () => {
      master.removeSio(sockets[0].id);
      expect(Object.keys(master.getSioList()).length).to.be.eql(0);
    });
  });

  describe('With 50 clients', () => {
    let sockets = [];

    before((done) => {
      sockets = addNewClients(50, done);
    });

    after(async () => {
      await removeEveryClients(master);
      expect(Object.keys(master.getSioList()).length).to.be.eql(0);
    });

    it('Socket list nicely filled', async () => {
      await waitAMinute(500);
      expect(Object.keys(master.getSioList()).length).to.be.eql(50);
    });
    it('Emit test with ping', (done) => {
      let doneAlready = 0;

      for (let socket of sockets) {
        socket.on('pong', () => {
          doneAlready++;
          if (doneAlready === sockets.length)
            done();
        });
        socket.emit('ping');
      }
    });
    it('Remove 50 clients', () => {
      removeEveryClients(master);
      expect(Object.keys(master.getSioList()).length).to.be.eql(0);
    });
  });
});
