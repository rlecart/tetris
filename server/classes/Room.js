const { defaultRules } = require('../../src/ressources/rules')
const { defaultGame } = require('../../src/ressources/game.js')
const utils = require('../utils')
const { Player } = require('./Player')
const server = require('../server.js')
const clonedeep = require('lodash.clonedeep')
const { refresh, initShapes } = require('../refresh.js')

exports.Room = class Room {
  constructor() {
    this._url = ''
    this._inGame = false
    this._nbPlayer = 0
    this._listPlayers = {}
    this._rules = defaultRules

    this._interval = undefined
    this._shapes = []
    this._shapesId = []

    this._readyToStart = {}
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

  getInGame() {
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
    this._inGame = false
  }

  resetUrl() {
    this._url = undefined
  }

  addNewPlayer(clientId, profil) {
    this._listPlayers = { ...this._listPlayers, [clientId]: new Player(profil, clientId) }
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

  startGame() {
    let socketClients = server.getSocketClientListFromRoom(this.getUrl(), true)

    initShapes(this)
    this.initGames()
    this.setInGame(true)
    this._interval = setInterval(this.gameLoop.bind(this), 1000, socketClients, this.getUrl())
    this._readyToStart = undefined
    // console.log(`interval ${this.getUrl()} init`)
  }

  getAllGames(only) {
    let ret = {}

    // console.log('getAllGames')
    // console.log(this.getListPlayers())
    // console.log(this.getListPlayers()._game)
    // console.log('getAllGames')

    if (only !== undefined)
      return (this.getListPlayers(only)._game) // a voir plus tard pour que ce soit utilise comme objet et pas acces direct
    for (let [key, value] of Object.entries(this.getListPlayers())) {
      console.log('getAllGames')
      console.log('key =', key)
      console.log('value =', value)
      ret = { ...ret, [key]: value.getGame() }
      console.log('getAllGames')
      return (ret)
    }
  }

  setAllGames(games) {
    console.log('setAllGames')
    console.log(this)
    console.log(games)
    console.log('setAllGames')
    for (let [key, value] of Object.entries(this.getListPlayers()))
      value.setGame(games[key])
  }

  createSpecList(obj, exception, url) {
    let ret = []

    for (let [key, value] of Object.entries(obj)) {
      if (key !== exception && value && value.lines) {
        ret.push({
          lines: value.lines,
          name: this.getListPlayers(key).name,
        })
      }
    }
    // console.log(ret)
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


    //--------------------------------------------------------------------------------------------------
    // ici je sais pas pourquoi gamesTmp ne chope que le premier joueur et pas le reste (enfin je crois)
    //--------------------------------------------------------------------------------------------------


    console.log('aaaaaaaaaaaaaaaaaaa\n\n')
    console.log(gamesTmp)
    // console.log(gamesTmp[key])
    console.log('aaaaaaaaaaaaaaaaaaa2\n\n')

    for (let [key, value] of Object.entries(socketClients)) {
      // console.log('key=', key)
      // console.log('value=', value)

      // if (gamesTmp[key] === undefined) {
      //   gamesTmp = {
      //     ...gamesTmp, [key]: {
      //       ...clonedeep(defaultGame)
      //     },
      //     url: url,
      //   }
      // }

      gamesTmp[key] = refresh(gamesTmp[key], this, key)
    }
    if (this.getInGame() === true) {
      this.setAllGames(gamesTmp)
      for (let [key, value] of Object.entries(socketClients))
        value.emit('refreshVue', this.getAllGames(key), this.createSpecList(this.getAllGames(), key, url))
    }
    // console.log('\n\n\n', gameRooms, gameRooms, '\n\n\n')
  }
}