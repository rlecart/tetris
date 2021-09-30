const generateUrl = () => {
  return (Math.random().toString(36).substring(7))
}

const createNewUrl = (roomsList) => {
  let url = generateUrl()
  while (roomsList[url])
    url = generateUrl()
  return (url)
}

const getArrayFromObject = (obj) => {
  let ret = []

  for (let [key, value] of Object.entries(obj))
    ret.push(value)
  return ret
}

const getRoomFromPlayerId = (playerId, master) => {
  let allRooms = master.getRoomsList()

  for (let roomUrl in allRooms) {
    let room = master.getRoom(roomUrl)
    if (room._listPlayers[playerId]) {
      return (room)
    }
  }
  return (undefined)
}

module.exports = { generateUrl, createNewUrl, getArrayFromObject, getRoomFromPlayerId }
