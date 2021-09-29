let { defaultRules } = require('../../src/ressources/rules.js')
let Player = require('./Player.js')
let Game = require('./Game.js')
let _ = require('lodash')
let { refresh, initShapes, addTetri } = require('../refresh.js')

module.exports = class Room {
  constructor() {
    this._url = ''
    this._inGame = false
    this._nbPlayer = 0
    this._listPlayers = {}
    this._rules = _.cloneDeep(defaultRules)
    this._isOut = {}


    this._interval = undefined
    this._shapes = []
    this._shapesId = []

    this._readyToStart = {}

    this._sioList = {}
    this._owner = undefined
    this._arrivalOrder = []
    this._pending = true
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

  isOut(id) {
    if (this._isOut !== undefined)
      return (this._isOut[id])
  }

  addOut(id) {
    this._isOut = { ...this._isOut, [id]: id }
    if (Object.keys(this._isOut).length >= this._nbPlayer - 1) {
      let winnerInfo = {}
      let winnerId

      console.log('nbplayer = ', this.getNbPlayer())
      if (this.getNbPlayer() > 1) {
        for (let key of Object.keys(this.getListPlayers())) {
          if (this._isOut[key] === undefined)
            winnerId = key
        }
        winnerInfo = {
          name: String(this.getListPlayers(winnerId).getName()),
          id: winnerId,
        }
        console.log('winnerInfo = ', winnerInfo)
      }
      console.log('winnerInfo out = ', winnerInfo)
      this._isOut = undefined
      this.endGame()
      this.emitAll('theEnd', undefined, { winnerInfo, owner: this.getOwner() })
      for (let [key, value] of Object.entries(this.getListPlayers()))
        value.setGame(undefined)
    }
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

  endGame(res) {
    clearInterval(this._interval)
    this.setPending(true)
    this._interval = undefined
    this.setInGame(undefined)
    setTimeout(() => { // laisser du temps a la derniere interval des players encore en cours
      this._shapes = []
      this._shapesId = []
      this.setInGame(false)
      if (res !== undefined)
        res()
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

  setPending(value) {
    this._pending = value
  }

  isPending() {
    return (this._pending)
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

    if (this.isOut(clientId) !== undefined)
      delete this._isOut[clientId]
    delete this._listPlayers[clientId]
    delete this._sioList[clientId]
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
  //console.log(this._shapes)
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
  roomInfo.owner = this._owner
  // roomInfo.listPlayers = utils.getArrayFromObject(this._listPlayers)
  //console.log(roomInfo.listPlayers)
  // console.log('cuicui')
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
  this.setPending(false)
  this._interval = setInterval(this.gameLoop.bind(this), 1000, this.getSio(), this.getUrl())
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
  // console.log(ret)
  let hiddenCols = new Array(ret.length)

  for (let player in ret) {
    hiddenCols[player] = new Array(ret[player].lines[0].length).fill(false)
    for (let line in ret[player].lines) {
      for (let i in ret[player].lines[line]) {
        if (hiddenCols[player][i] === false && ret[player].lines[line][i] !== 0 && ret[player].lines[line][i] !== 1)
          hiddenCols[player][i] = true
        else if (hiddenCols[player][i] === true)
          ret[player].lines[line][i] = 1
      }
    }
  }
  hiddenCols = null
  return (ret)
}

createSpecList(exception) {
  let hidden = true
  let retHidden = []
  let ret = []

  for (let [key, value] of Object.entries(this.getListPlayers())) {
    if (key !== exception && value && value.getGame() && value.getGame().getSpec()) {
      ret.push({
        lines: _.cloneDeep(value.getGame().getSpec()),
        name: value.getName(),
      })
    }
  }
  if (this.getNbPlayer() > 1 && ret) {
    if (hidden)
      retHidden = this.hiddenSpec(ret)
    return (retHidden)
  }
  return (ret)
}

initGames() {

  for (let [key, value] of Object.entries(this.getListPlayers())) {
    value.setNewGame(this.getShapes(), this.getShapesId())
  }
}

flatGames(only) {
  let ret

  if (only !== undefined) {
    ret = _.cloneDeep(this.getAllGames(only))
    addTetri(ret)
    return (ret)
  }
}

refreshAllVues(socketClients, url, exception) {
  for (let [key, value] of Object.entries(socketClients)) {
    if (this.isInGame() === true && key !== exception) {
      let flatGame = this.flatGames(key)
      value.emit('refreshVue', flatGame, this.createSpecList(key))
    }
  }
}

gameLoop(socketClients, url) {
  let gamesTmp = _.cloneDeep(this.getAllGames()) // parce qu'on a besoin que tout soit actualise en meme temps a la fin
  // ici need un deepclone ?? (pas sur que ce soit une copie quoi)
  for (let [key, value] of Object.entries(socketClients)) {
    if (this.isInGame() === true && !this.isOut(key)) {
      // console.log('\n\n\ngames', gamesTmp[key])
      gamesTmp[key] = refresh(gamesTmp[key], this, key)
      // console.log(gamesTmp[key], '\n\n\n\n')
    }
  }
  if (this.isInGame() === true) {
    this.setAllGames(gamesTmp)
    this.refreshAllVues(socketClients, url)
  }
  // console.log(this.getAllGames())
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
