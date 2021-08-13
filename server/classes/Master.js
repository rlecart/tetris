const { Room } = require('./Room')
const { Server } = require('./Server')
const { createNewUrl } = require('../utils')

exports.Master = class Master {
    constructor() {
      this._roomsList = {}
      this._sioClientList = {}
      this._server = {}
    }

    startServer() {
        this._server = new Server(this)
        this._server.startServer()
        this._server.listenSio(this)
    }

    addNewRoom(room) {
      this._roomsList = { ...this._roomsList, [room.getUrl()]: room }
    }
  
    getRoomsList() {
      return (this._roomsList)
    }
  
    getRoom(url) {
      if (url !== undefined && this._roomsList !== undefined && this._roomsList[url])
        return (this._roomsList[url])
    }
  
    getSioList(only) {
      if (only !== undefined)
        return (this._sioClientList[only])
      return (this._sioClientList)
    }

    setSioHbeat(id, value) {
        this._sioClientList[id].hbeat = value
    }
  
    getSioHbeat(id) {
        return (this._sioClientList[id].hbeat)
    }

    addNewSio(client) {
      this._sioClientList = { ...this._sioClientList, [client.id]: client }
    }
  
    createRoom(clientId, profil, cb) { // faut que j'enleve la cb pour redirect au front apres la reponse server
      if (profil.name) {
        let room = new Room(this)
        room.setUrl(createNewUrl(this.getRoomsList()))
        this.addNewRoom(room)
        this.joinRoom(clientId, profil, room.getUrl(), cb)
      }
    }
    
    joinRoom(clientId, profil, url, cb) { // pareil tej la cb
      let room = {}
  
      if (profil.name && (room = this.getRoom(url)) && !room.isInGame() && !room.getListPlayers(clientId) && room.getNbPlayer() < 8) {
        profil = { ...profil, url:[url] }
        room.addNewPlayer(clientId, profil)
        room.addSio(this.getSioList(clientId))
        console.log(clientId + ' joinroom ' + url)
        cb(`/#${url}[${profil.name}]`) // ca faut que je le tej
        room.emitAll('refreshRoomInfo', clientId, room.getRoomInfo())
      }
    }
  
    getSioListFromRoom(url, objVersion) { // pour choper les sockets des clients d'une room uniquement 
      let ret = objVersion ? {} : [] // est-ce que finalement c'est pas osef mtn car besoin d'un tableau des fois dans une ancienne version ?
      let room = {}
    
      if ((room = this.getRoom(url)) && room.getListPlayers()) {
        for (let [key, value] of Object.entries(room.getListPlayers())) {
          if (objVersion)
            ret = { ...ret, [key]: this.getSioList(key) }
          else
            ret.push(this.getSioList(key))
        }
      }
      return ret
    }
    
    closeRoom(room) {
      let clientsRoom = this.getSioListFromRoom(room.getUrl(), true)
    
      for (let [key, value] of Object.entries(clientsRoom)) {
        room.removePlayer(key)
      }
      room.resetUrl()
      console.log(`room ${room.getUrl()} closed`)
    }
  
    askToStartGame(clientId, profil, url, cb) {
      let room = {}
    
      if ((room = this.getRoom(url))) {
        room.emitAll('goToGame')
      }
    }
  
    tryToStart(clientsRTS, nbPlayers) {
      let i = 0
  
      for (let client in clientsRTS) // a changer pour iter sur obj ? pas besoin car juste besoin de compter ?
        i++
      if (i === nbPlayers)
        return true
      return false
    }
  
    readyToStart(clientId, url) {
      let res
      let room = {}

      if (url && clientId && (room = this.getRoom(url)) && room.getListPlayers(clientId)) {
        room.addReadyToStart(clientId)
        if (res = this.tryToStart(room.getReadyToStart(), room.getNbPlayer())) {
          room.launchGame(this.getSioListFromRoom(url, true))
        }
      }
    }
  
    askToMove(clientId, url, dir) {
      let room = {}
      let player = {}

      if ((room = this.getRoom(url)) && (player = room.getListPlayers(clientId)))
        player.move(dir, room)
    }
  }