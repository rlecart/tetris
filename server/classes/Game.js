let clonedeep = require('lodash.clonedeep')
let defaultGame = require('../../src/ressources/game.js')

module.exports = class Game {
  constructor(shapes, shapesId) {
    // this._parent = parent

    this._lines = clonedeep(defaultGame.lines)
    this._spec = clonedeep(defaultGame.lines)
    this._tetri = clonedeep(defaultGame.tetri)
    this._tetri.id = shapesId[0]
    this._tetri.nextId = shapesId[1]
    this._tetri.actualShape = shapes[0]
    this._tetri.nextShape = shapes[1]
    this._tetri.x = Math.trunc(this._lines[0].length / 2 - this._tetri.actualShape[0].length / 2)
    this._tetri.y = -1
    this._placed = clonedeep(defaultGame.placed)
  }

  setTetri(tetri) {
    this._tetri.id = tetri.id
    this._tetri.actualShape = tetri.actualShape
    this._tetri.nextId = tetri.nextId
    this._tetri.nextShape = tetri.nextShape
    this._tetri.rotation = tetri.rotation
    this._tetri.x = tetri.x
    this._tetri.y = tetri.y
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

  getSpec() {
    return (this._spec)
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

  refreshSpec(lines) {
    this._spec = clonedeep(lines)
  }
}