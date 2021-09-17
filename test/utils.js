let Master = require("../server/classes/Master.js")
let { expect } = require('chai')
let { defaultRules } = require('../src/ressources/rules.js')
const openSocket = require('socket.io-client')

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
}

const expectJoinRoom = (room, playerId, playerName, NbPlayer) => {
  var player = room.getListPlayers(playerId)

  expect(player.getId()).to.be.eql(playerId);
  expect(player.getProfil()).to.eql({
    ...playerName, url: room.getUrl(), owner: false
  });
  expect(room.getNbPlayer()).to.be.eql(NbPlayer);
}

const getRoomFromPlayerId = (playerId, master) => {
  var allRooms = master.getRoomsList()
  for (var roomUrl in allRooms) {
    var room = master.getRoom(roomUrl)
    if (room._listPlayers[playerId]) {
      return (room)
    }
  }
  return (undefined)
}

const addNewClients = (nb, done) => {
  let clients = []
  let socket
  let doneAlready = 0

  for (let i = 0; i < nb; i++) {
    socket = new openSocket('http://localhost:8000')
    clients.push(socket)
    socket.on('connect', () => {
      doneAlready++;
      if (doneAlready === nb)
        done();
    })
  }
  return (clients)
}

const removeEveryClients = (master) => { // faut que je trouve un truc pour qu'il await bien ce chien de mocha
  return (new Promise(res => {
    for (let client in master.getSioList()) {
      master.removeSio(client.id);
    }
    console.log(master.getSioList());
    res();
  }));
}

module.exports = { expectNewRoom, expectJoinRoom, getRoomFromPlayerId, addNewClients, removeEveryClients }
