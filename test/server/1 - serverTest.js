import { expect, assert } from 'chai';
import Master from '../../src/server/classes/Master.js';
import { addNewClients, removeEveryClients, waitAMinute } from '../helpers/helpers.js';

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

    before(async () => {
      sockets = await addNewClients(1);
    });

    after(async () => {
      await removeEveryClients(master);
      await waitAMinute(500);
      expect(Object.keys(master.getSioList()).length).to.be.eql(0);
    });

    it('Socket list exists', () => {
      assert.exists(master.getSioList());
    });
    it('Socket list nicely filled', async () => {
      await waitAMinute(500);
      expect(Object.keys(master.getSioList()).length).to.be.eql(1);
    });
    it('Emit test with ping', (done) => {
      sockets[0].on('pong', done);
      sockets[0].emit('ping');
    });
    it('Remove client', async () => {
      await master.removeSio(sockets[0].id);
      await waitAMinute(500);
      expect(Object.keys(master.getSioList()).length).to.be.eql(0);
    });
  });

  describe('With 50 clients', () => {
    let sockets = [];

    before(async () => {
      console.log('server counter avant = ', server.counter)
      sockets = await addNewClients(50);
      console.log('server counter = ', server.counter)
    });
    after(async () => {
      await removeEveryClients(master);
      await waitAMinute(500);
      expect(Object.keys(master.getSioList()).length).to.be.eql(0);
    });

    it('Socket list nicely filled', async () => {
      await waitAMinute(500);
      console.log('server.counter', server.counter)
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
    it('Remove 50 clients', async () => {
      await removeEveryClients(master);
      await waitAMinute(500);
      expect(Object.keys(master.getSioList()).length).to.be.eql(0);
    });
  });
});
