const { Game } = require('./Game')

exports.Player = class Player {
  constructor(profil, clientId) {
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

  deleteGame() {
    this._game = undefined
  }

  setNewGame(shapes, shapesId) {
    this._game = new Game(shapes, shapesId)
  }

  setGame(newGame) {
    this._game = newGame
  }
}