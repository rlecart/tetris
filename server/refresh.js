// const { anotherOnePlease } = require('../src/api.js')
const tetriminos = require('../src/ressources/tetriminos.js')
const server = require('./server.js')
const clonedeep = require('lodash.clonedeep')

const newRand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const newShape = (room, rand) => {
  const i = rand % 6

  room.shapesId.push(i + 2)
  return (tetriminos.tetriminos[i]) // deep clone ?
}

function initShapes(room) {
  room.shapes.push(newShape(room, newRand(1, 6)))
  room.shapes.push(newShape(room, newRand(1, 6)))
}

const createNewTetri = (game, room) => {
  game.placed++
  if (game.placed >= room.shapes.length - 1)
    room.shapes.push(newShape(room, newRand(1, 6)))
  game.tetri.actualShape = room.shapes[game.placed]
  game.tetri.nextShape = room.shapes[game.placed + 1]
  game.tetri.id = room.shapesId[game.placed]
  game.tetri.nextId = room.shapesId[game.placed + 1]
  game.tetri.x = Math.trunc(game.lines[0].length / 2 - game.tetri.actualShape[0].length / 2)
  game.tetri.y = -1
}

const addTetri = (game) => {
  let i = -1;
  let j = -1;
  let x = game.tetri.x
  let y = game.tetri.y
  let id = game.tetri.id
  let actual = game.tetri.actualShape

  while (++i < actual.length) {
    while (++j < actual[0].length) {
      if (actual[i][j] === 1) {
        // console.log(x, y)
        // console.log(game.tetri)
        game.lines[y][x] = id
      }
      x++
    }
    x = game.tetri.x
    j = -1;
    y++
  }
}

const checkTetri = (game, truePos) => {
  let i = -1;
  let j = -1;
  let x = game.tetri.x
  let y = game.tetri.y
  let actual = game.tetri.actualShape

  if (x + truePos.lengthX - 1 > game.lines[0].length
    || y + truePos.lengthY - 1 > game.lines.length)
    return (-1)
  while (++i < actual.length) {
    while (++j < actual[i].length) { // ici ? Bug des 11 cases des fois taille plateau
      if (actual[i][j] === 1 && game.lines[y][x] !== 0) {
        return (-1)
      }
      x++
    }
    j = -1;
    x = game.tetri.x
    y++
  }
  console.log('check ok\n')
  return (1)
}

const removeTetri = (game) => {
  let i = -1;
  let j = -1;
  let x = game.tetri.x
  let y = game.tetri.y
  let actual = game.tetri.actualShape

  while (++i < actual.length) {
    while (++j < actual[i].length) {
      if (actual[i][j] == 1)
        game.lines[y][x] = 0
      x++
    }
    x = game.tetri.x
    j = -1;
    y++
  }
}

const noMoreSpace = (game) => {
  if (game.tetri.y > 0)
    return (true)
  return (false)
}

const turnTetri = (game, dir) => {
  if (game.tetri.id === 5) {
    // console.log(game.tetri.actualShape)
    return (1)
  }
  let tmp = game.tetri.actualShape

  if (dir)
    tmp = tmp.map((val, index) => tmp.map(row => row[index]).reverse())
  else
    tmp = tmp.map((val, index) => tmp.map(row => row[index])).reverse()

  // tmp[0] = [tetri[0][2], tetri[1][2], tetri[2][2]]
  // tmp[1] = [tetri[0][1], tetri[1][1], tetri[2][1]]
  // tmp[2] = [tetri[0][0], tetri[1][0], tetri[2][0]]
  // if (0)
  game.tetri.actualShape = tmp
  return (0)

  //   00 02
  //   01 12
  //   02 22

  //   10 01
  //   11 11
  //   12 21

  //   20 00
  //   21 10
  //   22 20

  //   x 1 1 
  //   1 1 x
  //   x x x
}

const parseLen = (tab) => {
  let counterX = [0, 0, 0, 0]
  let counterY = [0, 0, 0, 0]
  let x = 0
  let y = 0
  let i = -1
  let j = -1

  while (++i < tab.length) {
    while (++j < tab[i].length) {
      if (tab[i][j] === 1) {
        counterX[j] = 1
        counterY[i] = 1
      }
    }
    j = -1
  }
  for (let val of counterX) {
    if (val === 1)
      x++
  }
  for (let val of counterY) {
    if (val === 1)
      y++
  }
  return ([x, y])
}

const parseTruePos = (tab) => {
  let x = tab[0].length
  let y = tab.length
  let lengthX = 0
  let lengthY = 0
  // let tmpX = 0
  let i = -1
  let j = -1

  while (++i < tab.length) {
    while (++j < tab[i].length) {
      if (tab[i][j] === 1) {
        // tmpX++
        if (j < x)
          x = j
        if (i < y)
          y = i
      }
    }
    // if (tmpX > lengthX)
    //   lengthX = tmpX
    // if (tmpX > 0)
    //   lengthY++
    // tmpX = 0
    j = -1
  }
  [lengthX, lengthY] = parseLen(tab)
  return ({ x, y, lengthX, lengthY })
}

const checkIfOk = (game, x, y, truePos) => {
  if (game.tetri.id === 5 && x === 0 && y === 0)
    return (0)
  if (game.tetri.x + truePos.x + x < 0
    || game.tetri.x + truePos.x + truePos.lengthX - 1 + x >= game.lines[0].length) {
    return (0)
  }
  if (game.tetri.y + truePos.y + y < 0
    || game.tetri.y + truePos.y + truePos.lengthY - 1 + y >= game.lines.length)
    return (1)
  if (x === 0 && y === 0
    && ((truePos.lengthX < truePos.lengthY && game.tetri.x + truePos.x + truePos.lengthX - 1 + truePos.lengthY - truePos.lengthX > game.lines[0].length)
      || (truePos.lengthY < truePos.lengthX && game.tetri.y + truePos.y + truePos.lengthY - 1 + truePos.lengthX - truePos.lengthY > game.lines.length))) {
    return (0)
  }
  return ('ok')
}

const moveTetri = (game, x, y) => {
  let truePos = parseTruePos(game.tetri.actualShape)
  let errors = checkIfOk(game, x, y, truePos)
  if (x === 0 && y === 0) {
    // console.log(truePos)
    // console.log(game.tetri)
  }
  // console.log(game.tetri.x, game.tetri.y, truePos)
  if (errors !== 'ok') {
    console.log(truePos)
    console.log(game.tetri)
    console.log('errors = ', errors)
    return (errors)
  }
  if (game.tetri.y !== -1 || (y === 0 && x !== 0))
    removeTetri(game)
  if (x === 0 && y === 0)
    turnTetri(game, true)
  game.tetri.y += y
  game.tetri.x += x
  if (checkTetri(game, truePos) === -1) {
    if (noMoreSpace(game) === false) {
      // console.log(game, game.tetri)
      return (-1)//gameover
    }
    else {
      game.tetri.y -= y
      game.tetri.x -= x
      if (x === 0 && y === 0)
        turnTetri(game, false)
      if (x === 0) {
        addTetri(game)
        if (x === 0 && y === 0)
          return (0)
        return (1)
      }
    }
  }
  addTetri(game)
  return (2)
}

const checkFilledLine = (game) => {
  let i = -1
  let count = 0

  while (++i < game.lines.length) {
    if (!(game.lines[i].includes(0)) && !(game.lines[i].includes(1))) {
      game.lines.splice(i, 1)
      game.lines.unshift(new Array(game.lines[0].length).fill(0))
      i--
      count++
    }
  }
  return (count)
}

const endGame = (room, id) => {
  console.log(room)
  // server.emitAll('endGame', room.url, undefined, server.getRoomInfo(room.url))
  // server.emitOnly('endGame', room.url, id, server.getRoomInfo(room.url))
  server.closeRoom(room)
}

function addFilledLine(room, exception, amount) {
  let players = server.getClientListFromRoom(room.url, true)

  for (let [key, value] of Object.entries(players)) {
    if (key !== exception) {
      for (let i = 0; i < amount; i++) {
        if (room[key].lines[0].find((elem) => { elem !== 0 })) {
          server.emitOnly('endGame', room.url, key, server.getRoomInfo(room.url))
          break;
        }
        else {
          if (room[key].tetri.y === 0)
            refresh(room[key], room, key)
          room[key].tetri.y--
          room[key].lines.push(new Array(room[key].lines[0].length).fill(1))
          room[key].lines.shift()
          refresh(room[key], room, key)
          server.emitOnly('refreshVue', room.url, key, room[key])
        }
      }
    }
  }
}

function refresh(game, room, id) {
  let hasMoved = 0
  let filledLines = 0

  if (game.placed === -1)
    createNewTetri(game, room)
  hasMoved = moveTetri(game, 0, 1)
  if (hasMoved == -1)
    endGame(room, id)
  else if (hasMoved == 1) {
    if ((filledLines = checkFilledLine(game)) > 0)
      addFilledLine(room, id, filledLines)
    createNewTetri(game, room)
    refresh(game, room, id)
  }
  return (game)
}


exports.refresh = refresh
exports.moveTetri = moveTetri
exports.initShapes = initShapes