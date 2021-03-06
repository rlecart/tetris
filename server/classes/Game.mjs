import clonedeep from 'lodash.clonedeep'
import defaultGame from '../../src/ressources/game.mjs'

export default class Game {
  constructor(shapes, shapesId) {
    // this._parent = parent

    this._lines = clonedeep(defaultGame.lines)
    this._tetri = clonedeep(defaultGame.tetri)
    this._tetri.id = shapesId[0]
    this._tetri.nextId = shapesId[1]
    this._tetri.actualShape = shapes[0]
    this._tetri.nextShape = shapes[1]
    this._placed = clonedeep(defaultGame.placed)
  }

  setTetri(tetri) {
    this._tetri.id = tetri.id
    this._tetri.actualShape = actualShape
    this._tetri.nextId = nextId
    this._tetri.nextShape = nextShape
    this._tetri.rotation = rotation
    this._tetri.x = x
    this._tetri.y = y
  }

  getTetri() {
    return (this._tetri)
  }

  getLines(i, j) {
    if (this._lines && i !== undefined) {
      if (this._lines[i] && j !== undefined)
        return (this._lines[i][j])
      return (this._lines[i])
    }
    return (this._lines)
  }

  setLines(i, j, value) {
    if (i !== undefined) {
      if (j !== undefined) {
        this._lines[i][j] = value
      }
      else
        this._lines[i] = value
    }
    else
      this._lines = value
  }

  getActualShape(i, j) {
    if (this._tetri) {
      if (this._tetri.actualShape && i !== undefined) {
        if (this._tetri.actualShape[i] && j !== undefined) {
          return (this._tetri.actualShape[i][j])
        }
        return (this._tetri.actualShape[i])
      }
    }
    return (this._tetri.actualShape)
  }

  addPlaced(nb) {
    this._placed += nb
  }

  getPlaced() {
    return (this._placed)
  }

  setActualShape(value) {
    this._tetri.actualShape = value
  }

  setNextShape(value) {
    this._tetri.nextShape = value
  }

  setId(value) {
    this._tetri.id = value
  }

  getId() {
    return (this._tetri.id)
  }

  setNextId(value) {
    this._tetri.nextId = value
  }

  getX() {
    return (this._tetri.x)
  }

  getY() {
    return (this._tetri.y)
  }

  addX(value) {
    this._tetri.x += value
  }

  addY(value) {
    this._tetri.y += value
  }

  subX(value) {
    this._tetri.x -= value
  }

  subY(value) {
    this._tetri.y -= value
  }

  setX(value) {
    this._tetri.x = value
  }

  setY(value) {
    this._tetri.y = value
  }

  removeFilledLine(i) {
    this._lines.splice(i, 1)
    this._lines.unshift(new Array(this._lines[0].length).fill(0))
  }

  fillLine() {
    this._lines.push(new Array(this.getLines(0).length).fill(1))
    this._lines.shift()
  }
}