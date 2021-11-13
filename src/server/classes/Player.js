import { moveTetri } from '../refresh.js';
import Game from './Game.js';

export default class Player {
  constructor(profil, clientId) {

    this._clientId = clientId;
    this._profil = profil;
    this._game = undefined;
  }

  get id() {
    return (this._clientId);
  }

  set id(value) {
    this._id = value;
  }

  get profil() {
    return (this._profil);
  }

  set profil(value) {
    this._profil = value;
  }

  get roomUrl() {
    return (this._profil.url);
  }

  set roomUrl(value) {
    this._roomUrl = value;
  }

  get name() {
    return (this._profil.name);
  }

  set name(value) {
    this._name = value;
  }

  get game() {
    return (this._game);
  }

  set game(value) {
    this._game = value;
  }

  deleteGame() {
    this.game = undefined;
  }

  setNewGame(shapes, shapesId) {
    this.game = new Game(shapes, shapesId);
  }

  move(dir, room) {
    let reponse = -2;

    if (dir === 'right')
      reponse = moveTetri(this.game, 1, 0);
    else if (dir === 'left')
      reponse = moveTetri(this.game, -1, 0);
    else if (dir === 'down')
      reponse = moveTetri(this.game, 0, 1);
    else if (dir === 'turn')
      reponse = moveTetri(this.game, 0, 0);
    else if (dir === 'stash') {
      while (reponse !== 1 && reponse !== 0)
        reponse = moveTetri(this.game, 0, 1);
    }
    if (reponse !== 0)
      room.emitOnly('refreshVue', this.id, room.flatGames(this.id), room.createSpecList(this.id));
  }
};