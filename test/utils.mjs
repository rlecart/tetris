import Master from "../server/classes/Master.mjs"

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

export { getGameFromPlayerId }
