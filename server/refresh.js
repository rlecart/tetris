// const { anotherOnePlease } = require('../src/api.js')
const tetriminos = require('../src/ressources/tetriminos.js')

const newShape = (game, choice, rand) => {
  const i = rand % 6

  if (choice == 'new')
    game.tetri.id = i + 2
  return (tetriminos.tetriminos[i])
}

const createNewTetri = (game) => {
  game.placed++
  game.tetri.shapes.push(newShape(game, 'new', new Date))
  game.tetri.actualShape = game.tetri.shapes[game.placed]
  game.tetri.nextShape = newShape(game, 'next', new Date / 2)
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

const moveTetri = (game, x, y) => {
  removeTetri(game)
  game.tetri.y += y
  if (game.tetri.x + x >= 0 && game.tetri.x + x <= game.lines[0].length - game.tetri.actualShape[0].length)
    game.tetri.x += x
  if (checkTetri(game) == -1) {
    if (noMoreSpace(game) == true)
      return (-1)//gameover
    else {
      game.tetri.y -= y
      game.tetri.x -= x
      if (x === 0) {
        addTetri(game)
        return (1)
      }
    }
  }
  addTetri(game)
  return (0)
}

function refresh(game) {
  let hasMoved = 0

  if (game.placed === -1)
    createNewTetri(game)
  else {
    // console.log('move')
    hasMoved = moveTetri(game, 0, 1)
    if (hasMoved == -1)
      process.exit(1)
    else if (hasMoved == 1) {
      createNewTetri(game)
    }
  }
  return (game)
}

exports.refresh = refresh
exports.moveTetri = moveTetri