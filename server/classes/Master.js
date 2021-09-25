let Room = require('./Room.js')
let mainServer = require('./Servers.js')
let { createNewUrl } = require('../utils.js')
let { refresh, endGame } = require('../refresh.js')
let _ = require('lodash')
const { askEverybodyToCalmDown } = require('../../src/api/clientApi.js')

module.exports = class Master {
  constructor() {
    this._roomsList = {}
    this._sioClientList = {}
    this._server = {}
  }

  startServer() {
    this._server = new mainServer(this)
    this._server.startServer()
    this._server.listenSio(this)
    // console.log('[Server completely started]')
  }

  stopServer() {
    this._server.stopListenSio(this._sioClientList)
    this._server.stopServer()
    this._server = undefined
    // console.log('[Server completely stopped]')
  }

  addNewRoom(room) {
    this._roomsList = { ...this._roomsList, [room.getUrl()]: room }
  }

  getServer() {
    return (this._server)
  }

  getRoomsList() {
    return (this._roomsList)
  }

  getRoom(url) {
    if (url !== undefined && this._roomsList !== undefined && this._roomsList[url] !== undefined)
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
    // this._sioClientList = { ...this._sioClientList, [client.id]: client }
    // let ret

    // if (this._sioClientList[client.id] !== undefined)
    //   this._sioClientList[client.id].push(client)
    // else {
    //   ret = new Array(client)
    // this._sioClientList = { ...this._sioClientList, [client.id]: ret }
    // }
    this._sioClientList = { ...this._sioClientList, [client.id]: client }

    // console.log('whaaaaaa')
    // console.log(client)
    // console.log('whaaaaaa fin')
  }

  removeSio(client) {
    if (this._sioClientList[client] !== undefined) {
      this._sioClientList[client].disconnect()
      delete this._sioClientList[client]
    }
  }

  createRoom(clientId, profil, res) {
    if (profil.name && clientId !== undefined) {
      let room = new Room(this)
      room.setUrl(createNewUrl(this.getRoomsList()))
      this.addNewRoom(room)
      this.joinRoom(clientId, profil, room.getUrl(), res)
    }
  }

  joinRoom(clientId, profil, url, res) {
    let room = {}

    if (profil.name && (room = this.getRoom(url)) && !room.isInGame() && !room.getListPlayers(clientId) && room.getNbPlayer() < 8) {
      profil = { ...profil, url: url }
      room.addNewPlayer(clientId, profil)
      room.addSio(this.getSioList(clientId))
      //console.log(clientId + ' joinroom ' + url)
      room.emitAll('refreshRoomInfo', clientId, room.getRoomInfo())
      res(url)
      // room.emitOnly('goToRoom', clientId, url)
      // console.log('room joined')
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

  leaveRoom(clientId, url, res) {
    let room = {}

    if ((room = this.getRoom(url)) && room.getListPlayers(clientId)) {
      room.removePlayer(clientId)
      if (room.getNbPlayer() <= 0) {
        this.closeRoom(room)
      }
      room.emitAll('refreshRoomInfo', clientId, room.getRoomInfo())
      res()
    }
  }

  closeRoom(room) {
    let url = room.getUrl()
    let clientsRoom = this.getSioListFromRoom(url, true)

    for (let key of Object.keys(clientsRoom)) {
      room.removePlayer(key)
    }
    room.resetUrl()
    this._roomsList[url] = undefined
    delete this._roomsList[url]
    //console.log(`room ${url} closed`)
  }

  askToStartGame(clientId, url, res) {
    let room = {}

    if ((room = this.getRoom(url)) && room.isOwner(clientId)) {
      room.emitAll('goToGame')
    }
    res()
  }

  askToEndGame(clientId, url, res) {
    let room = {}

    if ((room = this.getRoom(url)) && room.isOwner(clientId)) {
      endGame(room, clientId, res)
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

  readyToStart(clientId, url, res) {
    let result
    let room = {}

    if (url && clientId && (room = this.getRoom(url)) && room.getListPlayers(clientId) && room.isInGame() === false) {
      room.addReadyToStart(clientId)
      if (result = this.tryToStart(room.getReadyToStart(), room.getNbPlayer())) {
        room.launchGame(this.getSioListFromRoom(url, true))
      }
      res()
    }
  }

  askToMove(clientId, url, dir, res, rej) {
    let room = {}
    let player = {}

    // console.log(clientId)
    if ((room = this.getRoom(url)) && (player = room.getListPlayers(clientId))) {
      player.move(dir, room)
      res()
    }
    else
      rej('[MOVE] Cant\'t find room or player')
  }

  askEverybodyToCalmDown(clientId, url, res) {
    let room = {}
    let sioList = {}

    if ((room = this.getRoom(url)) && room.getOwner() === clientId && (sioList = room.getSio())) {
      for (let [key, value] of Object.entries(sioList)) {
        value.emit('nowChillOutDude', `/${url}[${String(room.getListPlayers(key).getName())}]`)
        res()
      }
    }
    else
      rej('[CALMDOWN] Cant\'t find room or bad owner or can\'t find sioList')
  }
}