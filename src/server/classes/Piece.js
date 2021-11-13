import cloneDeep from 'lodash/cloneDeep.js';
import defaultGame from '../../ressources/defaultGame.js';
import defaultPiece from '../../ressources/defaultPiece.js';

export default class Piece {
  constructor(shapes, shapesId) {
    this._rotation = defaultPiece.rotation;
    this._id = shapesId[0];
    this._nextId = shapesId[1];
    this._actualShape = shapes[0];
    this._nextShape = shapes[1];
    this._x = Math.trunc(defaultGame.lines[0].length / 2 - this._actualShape[0].length / 2);
    this._y = -1;
  }

  get actualShape() {
    return (this._actualShape);
  }

  set actualShape(value) {
    this._actualShape = value;
  }

  get id() {
    return (this._id);
  }

  set id(value) {
    this._id = value;
  }

  get x() {
    return (this._x);
  }

  set x(value) {
    this._x = value;
  }

  get y() {
    return (this._y);
  }

  set y(value) {
    this._y = value;
  }

  set nextShape(value) {
    this._nextShape = value;
  }

  get nextShape() {
    return (this._nextShape);
  }

  set nextId(value) {
    this._nextId = value;
  }

  get nextId() {
    return (this._nextId);
  }

  set rotation(value) {
    this._rotation = value;
  }

  get rotation() {
    return (this._rotation);
  }

  get formated() {
    let ret = {};

    ret.rotation = this.rotation;
    ret.id = this.id;
    ret.nextId = this.nextId;
    ret.actualShape = this.actualShape;
    ret.nextShape = this.nextShape;
    ret.x = this.x;
    ret.y = this.y;
    return (ret);
  }
}