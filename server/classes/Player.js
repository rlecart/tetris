const { refresh } = require('../refresh.js')

const { Game } = require('./Game')

exports.Player = class Player {
  constructor(profil, clientId, parent) {
    this._parent = parent

    this._clientId = clientId
    this._profil = profil
    this._game = undefined
  }

  getId() {
    return (this._clientId)
  }

  getProfil() {
    return (this._profil)
  }
  
  getName() {
    return (this._profil.name)
  }

  getGame() {
    return (this._game)
  }

  getParent() {
    return (this._parent)
  }

  deleteGame() {
    this._game = undefined
  }

  setNewGame(shapes, shapesId) {
    this._game = new Game(shapes, shapesId)
  }

  setGame(newGame) {
    this._game = newGame
  }

  move(dir) {
    let reponse = -1
    let room = this.getParent()
  
    if (dir === 'right')
      reponse = refresh.moveTetri(this.getGame(), 1, 0)
    else if (dir === 'left')
      reponse = refresh.moveTetri(this.getGame(), -1, 0)
    else if (dir === 'down')
      reponse = refresh.moveTetri(this.getGame(), 0, 1)
    else if (dir === 'turn')
      reponse = refresh.moveTetri(this.getGame(), 0, 0)
    if (reponse !== 0)
      room.emitOnly('refreshVue', clientId, this.getGame(), room.createSpecList(this))
  }
}