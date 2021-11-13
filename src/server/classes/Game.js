import cloneDeep from 'lodash/cloneDeep.js';
import defaultGame from '../../ressources/defaultGame.js';
import Piece from './Piece.js';

export default class Game {
  constructor(shapes, shapesId) {
    this._lines = cloneDeep(defaultGame.lines);
    this._spec = cloneDeep(defaultGame.lines);
    this._tetri = new Piece(shapes, shapesId);
    this._placed = cloneDeep(defaultGame.placed);
    this._isWaiting = false;
  }

  get isWaiting() {
    return (this._isWaiting);
  }

  set isWaiting(value) {
    this._isWaiting = value;
  }

  get tetri() {
    return (this._tetri);
  }

  set tetri(value) {
    this._tetri = value;
  }

  get lines() {
    return (this._lines);
  }

  set lines(value) {
    this._lines = value;
  }

  get spec() {
    return (this._spec);
  }

  set spec(value) {
    this._spec = value;
  }

  get placed() {
    return (this._placed);
  }

  set placed(value) {
    this._placed = value;
  }

  get formated() {
    let ret = {};

    ret.lines = this.lines;
    ret.tetri = this.tetri.formated;
    ret.placed = this.placed;
    return (ret);
  }

  removeFilledLine(i) {
    this.lines.splice(i, 1);
    this.lines.unshift(new Array(this.lines[0].length).fill(0));
  }

  fillLine() {
    this.lines.push(new Array(this.lines[0].length).fill(1));
    this.lines.shift();
    this.refreshSpec(this.lines);
  }

  refreshSpec(lines) {
    this.spec = cloneDeep(lines);
  }
};