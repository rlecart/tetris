let Master = require("../server/classes/Master.js")
let { expect } = require('chai')
let { defaultRules } = require('../src/ressources/rules.js')

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
  expect(room.getArrivalOrder()).to.be.eql([ playerId ]);
}

const expectJoinRoom = (room, playerId, playerName, NbPlayer) =>  {
  var player = room.getListPlayers(playerId)

  expect(player.getId()).to.be.eql(playerId);
  expect(player.getProfil()).to.eql({
    ...playerName, url: room.getUrl(), owner: false
  });
  expect(room.getNbPlayer()).to.be.eql(NbPlayer);
}

const getGameFromPlayerId = (playerId, master) => {
  var allRooms = master.getRoomsList()
  for (var roomUrl in allRooms){
    var room = master.getRoom(roomUrl)
    if (room._listPlayers[playerId]) {
      return(room)
    }
  }
  return(undefined)
}

module.exports = { expectNewRoom, expectJoinRoom, getGameFromPlayerId }
