let { expect } = require('chai');
let { defaultRules } = require('../src/ressources/rules.js');
const openSocket = require('socket.io-client');

const expectNewRoom = (room, playerId) => {
  expect(room.isInGame()).to.be.eql(false);
  expect(room).to.exist;
  expect(room.getNbPlayer()).to.be.eql(1);
  expect(room.getRules()).to.be.eql(defaultRules);
  expect(room.getInterval()).to.be.eql(undefined);
  expect(room.getShapes()).to.be.eql([]);
  expect(room.getShapesId()).to.be.eql([]);
  expect(room.getReadyToStart()).to.be.eql({});
  expect(room.getReadyToStart()).to.be.eql({});
  expect(room.getOwner()).to.be.eql(playerId);
  expect(room.getArrivalOrder()).to.be.eql([playerId]);
};

const expectJoinRoom = (room, playerId, playerName, nbPlayer) => {
  let player = room.getListPlayers(playerId);

  expect(player.getId()).to.be.eql(playerId);
  expect(player.getProfil()).to.eql({
    ...playerName, url: room.getUrl(), owner: false
  });
  expect(room.getNbPlayer()).to.be.eql(nbPlayer);
};

const addNewClients = (nb, done, addOn) => {
  let clients = [];
  let socket;
  let doneAlready = 0;

  for (let i = 0; i < nb; i++) {
    socket = new openSocket('http://localhost:8000');
    clients.push(socket);
    socket.on('connect', () => {
      if (addOn !== undefined) {
        for (let [key, value] of Object.entries(addOn))
          socket.on(key, value);
      }
      doneAlready++;
      if (doneAlready === nb)
        done();
    });
  }
  return (clients);
};

const removeEveryClients = (master) => {
  return (new Promise(res => {
    for (let client in master.getSioList()) {
      master.removeSio(client);
    }
    res();
  }));
};

const waitAMinute = (ms) => {
  return (new Promise(res => {
    setTimeout(() => res(), ms);
  }));
};

module.exports = { expectNewRoom, expectJoinRoom, addNewClients, removeEveryClients, waitAMinute };
