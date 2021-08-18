import {moveTetri} from '../refresh.mjs'
import Game from './Game.mjs'

export default class Player {
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

  getRoomUrl() {
    return (this._profil.url)
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

  move(dir, room) {
    let reponse = -2

    if (dir === 'right')
      reponse = moveTetri(this.getGame(), 1, 0)
    else if (dir === 'left')
      reponse = moveTetri(this.getGame(), -1, 0)
    else if (dir === 'down')
      reponse = moveTetri(this.getGame(), 0, 1)
    else if (dir === 'turn')
      reponse = moveTetri(this.getGame(), 0, 0)
    else if (dir === 'stash') {
      while (reponse === 2 || reponse === -2)
        reponse = moveTetri(this.getGame(), 0, 1)
    }
    if (reponse !== 0)
      room.emitOnly('refreshVue', this.getId(), this.getGame(), room.createSpecList(this.getId()))
  }
}