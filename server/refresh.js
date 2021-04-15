// const { anotherOnePlease } = require('../src/api.js')
const tetriminos = require('../src/ressources/tetriminos.js')
const server = require('./server.js')

const newRand = (min, max) => {
 return Math.floor(Math.random() * (max - min + 1)) + min;
}

const newShape = (game, choice, rand) => {
  const i = rand % 6

  if (choice == 'new')
    game.tetri.id = i + 2
  return (tetriminos.tetriminos[i])
}

const createNewTetri = (game) => {
  game.placed++
  game.tetri.shapes.push(newShape(game, 'new', newRand(1, 6)))
  game.tetri.actualShape = game.tetri.shapes[game.placed]
  game.tetri.nextShape = newShape(game, 'next', newRand(1, 6))
  game.tetri.x = Math.trunc(game.lines[0].length / 2 - game.tetri.actualShape[0].length / 2)
  game.tetri.y = 0
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
      if (actual[i][j] == 1)
        game.lines[y][x] = id
      x++
    }
    x = game.tetri.x
    j = -1;
    y++
  }
}

const checkTetri = (game) => {
  let i = -1;
  let j = -1;
  let x = game.tetri.x
  let y = game.tetri.y
  let actual = game.tetri.actualShape

  while (++i < actual.length) {
    while (++j < actual[0].length) {
      if (actual[i][j] == 1 && game.lines[y][x] !== 0)
        return (-1)
      x++
    }
    j = -1;
    x = game.tetri.x
    y++
  }
  return (1)
}

const removeTetri = (game) => {
  let i = -1;
  let j = -1;
  let x = game.tetri.x
  let y = game.tetri.y
  let actual = game.tetri.actualShape

  while (++i < actual.length) {
    while (++j < actual[0].length) {
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
  if (game.tetri.y == 1)
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

  //   x 1 1 x
  //   x 1 1 x
  //   x x x x
}

const parseTruePos = (tab) => {
  let x = tab[0].length
  let y = tab.length
  let lengthX = 0
  let lengthY = 0
  let tmpX = 0
  let i = -1
  let j = -1

  while (++i < tab.length) {
    while (++j < tab[i].length) {
      if (tab[i][j] === 1) {
        tmpX++
        if (j < x)
          x = j
        if (i < y)
          y = i
      }
    }
    if (tmpX > lengthX)
      lengthX = tmpX
    if (tmpX > 0)
      lengthY++
    tmpX = 0
    j = -1
  }
  return ({ x, y, lengthX, lengthY })
}

const checkIfOk = (game, x, y, truePos) => {
  if (game.tetri.id === 5 && x === 0 && y === 0)
    return (0)
  if (game.tetri.x + truePos.x + x < 0
    || game.tetri.x + truePos.x + truePos.lengthX + x > game.lines[0].length)
    return (0)
  if (game.tetri.y + truePos.y + y < 0
    || game.tetri.y + truePos.y + truePos.lengthY + y > game.lines.length)
    return (1)
  return ('ok')
}

const moveTetri = (game, x, y) => {
  let truePos = parseTruePos(game.tetri.actualShape)
  let errors = checkIfOk(game, x, y, truePos)

  if (errors !== 'ok')
    return (errors)
  removeTetri(game)
  if (x === 0 && y === 0)
    turnTetri(game, true)
  game.tetri.y += y
  game.tetri.x += x
  if (checkTetri(game) == -1) {
    if (noMoreSpace(game) == true)
      return (-1)//gameover
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

  while (++i < game.lines.length) {
    if (!(game.lines[i].includes(0)) && !(game.lines[i].includes(-1))) {
      game.lines.splice(i, 1)
      game.lines.unshift(new Array(game.lines[0].length).fill(0))
      i--
    }
  }
}

const endGame = (game) => {
  server.resetInterval()
  server.pushToClient('endgame')
}

function refresh(game) {
  let hasMoved = 0

  if (game.placed === -1)
    createNewTetri(game)
  else {
    // console.log('move')
    hasMoved = moveTetri(game, 0, 1)
    if (hasMoved == -1)
      endGame(game)
    else if (hasMoved == 1) {
      checkFilledLine(game)
      createNewTetri(game)
      server.gameLoop()
      // server.resetInterval(game)
    }
  }
  return (game)
}

exports.refresh = refresh
exports.moveTetri = moveTetri