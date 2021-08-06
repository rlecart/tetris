const { defaultRules } = require('../../src/ressources/rules')
const utils = require('../utils')
const { Player } = require('./Player')
const server = require('../server.js')

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
    if (player)
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

  resetInterval() {
    this._interval = undefined
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

  addNewShape(shapes) { // a checker comment ca recupere les shapes et shapeId
    for (let shape in shapes.shapes)
      this._shapes.push(shape)
    this._shapesId = shapes._shapesId
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
    if (cb)
      cb(roomInfo)
    else
      return roomInfo
  }

  launchInterval() {
    let clientsRoom = server.getSocketClientListFromRoom(this.getUrl(), true)
    this._interval = setInterval(this.gameLoop, 1000, clientsRoom, this.getUrl())
    console.log(`interval ${this.getUrl()} init`)
  }

  getGames(only) {
    let ret = {}

    if (only)
      return (this._listPlayers[only].game)
    for (let [key, value] of Object.entries(this._listPlayers)) {
      ret = { ...ret, [key]: this._listPlayers[key].game }
      return (ret)
    }
  }

  setAllGames(games) {
    for (let [key, value] of Object.entries(this._listPlayers))
      this._listPlayers = { ...this._listPlayers, [key]: games[key] }
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
  

  gameLoop(clientsRoom, url) { // ici je comprend paaaaaas
    let gamesTmp = this.getGames() // parce qu'on a besoin que tout soit actualise en meme temps a la fin
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaa\n')

    for (let [key, value] of Object.entries(clientsRoom)) {
      // console.log('key=', key)
      // console.log('value=', value)
      if (gamesTmp[key] === undefined) {
        gamesTmp = {
          ...gamesTmp, [key]: {
            ...clonedeep(game.game)
          },
          url: url,
        }
      }
      gamesTmp[key] = refresh.refresh(gamesTmp[key], gamesTmp, key)
    }
    if (this.getInGame() === true) {
      this.setAllGames(gamesTmp)
      for (let [key, value] of Object.entries(clientsRoom))
        value.emit('refreshVue', this.getGames(key), this.createSpecList(this.getGames(), key, url))
    }
    // console.log('\n\n\n', gameRooms, gameRooms, '\n\n\n')
  }
}