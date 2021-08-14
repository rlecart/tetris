const { defaultRules } = require('../../src/ressources/rules')
const utils = require('../utils')
const { Player } = require('./Player')
const server = require('../server.js')
const _ = require('lodash')
const { refresh, initShapes } = require('../refresh.js')

exports.Room = class Room {
  constructor() {
    this._url = ''
    this._inGame = false
    this._nbPlayer = 0
    this._listPlayers = {}
    this._rules = _.cloneDeep(defaultRules)


    this._interval = undefined
    this._shapes = []
    this._shapesId = []

    this._readyToStart = {}

    this._sioList = {}
    this._owner = undefined
    this._arrivalOrder = []
  }

  addSio(sio) {
    this._sioList = { ...this._sioList, [sio.id]: sio }
  }

  removeSio(id) {
    this._sioList = { ...this._sioList, [id]: undefined }
  }

  getSio(id) {
    if (id !== undefined)
      return (this._sioList[id])
    return (this._sioList)
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
    this._shapes = []
    this._shapesId = []
    this.setInGame(false)
  }

  resetUrl() {
    this._url = undefined
  }

  addNewPlayer(clientId, profil) {
    let owner = false

    if (this._nbPlayer === 0) {
      this._owner = clientId
      owner = true
    }
    profil = { ...profil, owner: owner }
    this._arrivalOrder.push(clientId)
    this._listPlayers = { ...this._listPlayers, [clientId]: new Player(profil, clientId, this) }
    this._nbPlayer++
  }

  removePlayer(clientId) {
    if (this._owner === clientId) {
      this._arrivalOrder.shift()
      this._owner = this._arrivalOrder[0]
      this._listPlayers[this._owner]._profil.owner = true
    }
    delete this._listPlayers[clientId]
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
    roomInfo.listPlayers = this._listPlayers // alors ici ca envoie les clientId et c'est dangereux niveau secu (peut-etre ?)
    // roomInfo.listPlayers = utils.getArrayFromObject(this._listPlayers)
    console.log(roomInfo.listPlayers)
    if (cb !== undefined)
      cb(roomInfo)
    else
      return (roomInfo)
  }

  isOwner(id) {
    if (this._owner === id)
      return (true)
    return (false)
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

  emitAll(message, except, obj, spec) {
    let clientList = this.getSio()

    for (let [key, value] of Object.entries(clientList)) {
      if (key !== except) {
        value.emit(message, obj, spec) // ici ca pete la stack, a cause de parent enfin j'imagine
      }
    }
  }

  emitOnly(message, only, obj, spec) {
    let clientList = this.getSio()

    for (let [key, value] of Object.entries(clientList)) {
      if (key === only)
        value.emit(message, obj, spec) // ici ca pete la stack, a cause de parent enfin j'imagine
    }
  }
}