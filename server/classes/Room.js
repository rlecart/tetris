let {defaultRules} = require('../../src/ressources/rules.js')
let Player = require('./Player.js')
let _ = require('lodash')
let {refresh, initShapes} = require('../refresh.js')

module.exports = class Room {
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
    if (sio && sio.id)
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
    this.setInGame(false)
    setTimeout(() => {
      this._shapes = []
      this._shapesId = []
    }, 1500)
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
    this._nbPlayer--
    if (this._owner === clientId) {
      // this._arrivalOrder.shift()
      if (this._nbPlayer > 0) {
        this._owner = this._arrivalOrder[1]
        this._listPlayers[this._owner]._profil.owner = true
      }
    }
    this._arrivalOrder.splice(this._arrivalOrder.indexOf(clientId), 1)

    delete this._listPlayers[clientId]
    this.emitAll('refreshRoomInfo', clientId, this.getRoomInfo())
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

  getRules() {
    return (this._rules)
  }

  getInterval() {
    return (this._interval)
  }

  getOwner() {
    return (this._owner)
  }

  getArrivalOrder() {
    return (this._arrivalOrder)
  }

  getRoomInfo() {
    let roomInfo = {}

    roomInfo.url = this._url
    roomInfo.inGame = this._inGame
    roomInfo.nbPlayer = this._nbPlayer
    roomInfo.rules = this._rules
    roomInfo.listPlayers = this._listPlayers // alors ici ca envoie les clientId et c'est dangereux niveau secu (peut-etre ?)
    // roomInfo.listPlayers = utils.getArrayFromObject(this._listPlayers)
    //console.log(roomInfo.listPlayers)
    return (roomInfo)
  }

  isOwner(id) {
    if (this._owner === id)
      return (true)
    return (false)
  }
ari
  launchGame(sio) {
    // let socketClients = server.getSioListFromRoom(this.getUrl(), true)

    initShapes(this)
    this.initGames()
    this.setInGame(true)
    this._interval = setInterval(this.gameLoop.bind(this), 1000, sio, this.getUrl())
    this._readyToStart = undefined
    //console.log(`interval ${this.getUrl()} init`)
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

  hiddenSpec(ret) {
    let hiddenCols = new Array(ret[0].lines[0].length).fill(false)

    //console.log(ret)
    for (let player of ret) {
      for (let line of player.lines) {
        for (let i in line) {
          if (hiddenCols[i] === false && line[i] !== 0 && line[i] !== 1)
            hiddenCols[i] = true
          else if (hiddenCols[i] === true)
            line[i] = 1
        }
      }
    }
    return (ret)
  }

  createSpecList(exception) {
    let hidden = true
    let ret = []

    for (let [key, value] of Object.entries(this.getListPlayers())) {
      if (key !== exception && value && value.getGame() && value.getGame().getLines()) {
        ret.push({
          lines: _.cloneDeep(value.getGame().getLines()),
          name: value.getName(),
        })
      }
    }
    if (hidden && ret)
      return (this.hiddenSpec(ret))
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
      if (this.isInGame() === true) {
        gamesTmp[key] = refresh(gamesTmp[key], this, key)
      }
    }
    if (this.isInGame() === true) {
      this.setAllGames(gamesTmp)
      for (let [key, value] of Object.entries(socketClients)) {
        if (this.isInGame() === true)
          value.emit('refreshVue', this.getAllGames(key), this.createSpecList(key))
      }
    }
  }

  emitAll(message, except, obj, spec) {
    let clientList = this.getSio()

    for (let [key, value] of Object.entries(clientList)) {
      if (key !== except) {
        value.emit(message, obj, spec)
      }
    }
  }

  emitOnly(message, only, obj, spec) {
    let clientList = this.getSio()

    for (let [key, value] of Object.entries(clientList)) {
      if (key === only)
        value.emit(message, obj, spec)
    }
  }
}
