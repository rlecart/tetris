const { defaultRules } = require('../../src/ressources/rules')
const utils = require('../utils')
const { Player } = require('./Player')
const server = require('../server.js')
const _ = require('lodash')
// const { clonedeep } = require('lodash.clonedeep')
const { refresh, initShapes } = require('../refresh.js')

exports.Room = class Room {
  constructor(parent) {
    this._parent = parent
    
    this._url = ''
    this._inGame = false
    this._nbPlayer = 0
    this._listPlayers = {}
    this._rules = _.cloneDeep(defaultRules)

    this._interval = undefined
    this._shapes = []
    this._shapesId = []

    this._readyToStart = {}
  }

  getParent() {
    return (this._parent)
  }

  setUrl(url) {
    this._url = url
  }

  getUrl() {
    return (this._url)
  }

  getListPlayers(player) {
    if (player !== undefined)
      return (this._listPlayers[player])
    return (this._listPlayers)
  }

  isInGame() {
    return (this._inGame)
  }

  getNbPlayer() {
    return (this._nbPlayer)
  }

  setInGame(value) {
    this._inGame = value
  }

  endGame() {
    clearInterval(this._interval)
    this._interval = undefined
    this.setInGame(false)
  }

  resetUrl() {
    this._url = undefined
  }

  addNewPlayer(clientId, profil) {
    this._listPlayers = { ...this._listPlayers, [clientId]: new Player(profil, clientId, this) }
    this._nbPlayer++
  }

  removePlayer(clientId) {
    this._listPlayers[clientId] = undefined
    this._nbPlayer--
  }

  addReadyToStart(clientId) {
    this._readyToStart = { ...this._readyToStart, [clientId]: true }
  }

  resetReadyToStart() {
    this._readyToStart = undefined
  }

  getShapes(i) {
    if (i !== undefined)
      return (this._shapes[i])
    return (this._shapes)
  }

  getShapesId(i) {
    if (i !== undefined)
      return (this._shapesId[i])
    return (this._shapesId)
  }

  addNewShape(shape) { // a checker comment ca recupere les shapes et shapeId
    // for (let shape of shapes)
    this._shapes.push(shape)
    // this._shapesId = shapes._shapesId
  }

  addShapesId(id) {
    this._shapesId.push(id)
  }

  getReadyToStart() {
    return (this._readyToStart)
  }

  getRoomInfo(cb) {
    let roomInfo = {}

    roomInfo.url = this._url
    roomInfo.inGame = this._inGame
    roomInfo.nbPlayer = this._nbPlayer
    roomInfo.rules = this._rules
    roomInfo.listPlayers = utils.getArrayFromObject(this._listPlayers)
    if (cb !== undefined)
      cb(roomInfo)
    else
      return roomInfo
  }

  launchGame(sio) {
    // let socketClients = server.getSioListFromRoom(this.getUrl(), true)

    initShapes(this)
    this.initGames()
    this.setInGame(true)
    this._interval = setInterval(this.gameLoop.bind(this), 1000, sio, this.getUrl())
    this._readyToStart = undefined
    console.log(`interval ${this.getUrl()} init`)
  }

  getAllGames(only, exception) {
    let ret = {}
    let playersList = {}

    if (only !== undefined)
      return (this.getListPlayers(only)._game) // a voir plus tard pour que ce soit utilise comme objet et pas acces direct
    else
      playersList = this.getListPlayers()
    for (let [key, value] of Object.entries(playersList)) {
      if (key !== exception && key !== undefined)
        ret = { ...ret, [key]: value.getGame() }
    }
    return (ret)
  }

  setAllGames(games) {
    for (let [key, value] of Object.entries(this.getListPlayers()))
      value.setGame(games[key])
  }

  createSpecList(exception) {
    let ret = []

    for (let [key, value] of Object.entries(this.getListPlayers())) {
      if (key !== exception && value && value.lines) {
        ret.push({
          lines: value.getGame().getLines(),
          name: value.getName(),
        })
      }
    }
    return ret
  }

  initGames() {
    for (let [key, value] of Object.entries(this.getListPlayers())) {
      value.setNewGame(this.getShapes(), this.getShapesId())
    }
  }

  gameLoop(socketClients, url) {
    let gamesTmp = this.getAllGames() // parce qu'on a besoin que tout soit actualise en meme temps a la fin
    // ici need un deepclone ?? (pas sur que ce soit une copie quoi)

    for (let [key, value] of Object.entries(socketClients)) {
      gamesTmp[key] = refresh(gamesTmp[key], this, key)
    }
    if (this.isInGame() === true) {
      this.setAllGames(gamesTmp)
      for (let [key, value] of Object.entries(socketClients))
        value.emit('refreshVue', this.getAllGames(key), this.createSpecList(this.getAllGames(), key, url))
    }
  }

  getSioFromParent() {
    return (this.getParent().getSioListFromRoom(this.getUrl()))
  }

  emitAll(message, except, obj, spec) {
    let clientList = this.getSioFromParent()
  
    for (let [key, value] of Object.entries(clientList)) {
      if (key !== except) {
        value.emit(message, _.omit(obj, ['_parent', '_parent']), spec) // ici ca pete la stack, a cause de parent enfin j'imagine
      }
    }
  }
  
  emitOnly(message, only, obj, spec) {
    let clientList = this.getSioFromParent()
  
    for (let [key, value] of Object.entries(clientList)) {
      if (key === only)
        value.emit(message, _.omit(obj, ['_parent', 'parent']), spec) // ici ca pete la stack, a cause de parent enfin j'imagine
    }
  }
}