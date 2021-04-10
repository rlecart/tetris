const tetriminos = require('../src/ressources/tetriminos.js')

const newShape = () => {
  // const i = new Date % 6
  const i = 4;
  return (tetriminos[i])
}

const initGame = (game) => {
  game.tetri.shapes.post(newShape())
  game.tetri.newShape = newShape()
  game.tetri.x = game.lines[0].length / 2 - game.tetri.actualShape[0].length / 2
  game.tetri.y = 0

  //une version plus clean de cette fonction ?
}

const checkCollision = (game) => {
  const toTry = game.lines.subarray(game.tetri.y, game.tetri.actualShape.length)
  console.log(toTry)

  //ici


  return (0)
}

const moveTetri = (game) => {
  game.tetri.y++
  if (checkCollision(game) && tryPut(game))
    ;//gameover
}

function refresh(game) {
  if (!game.placed)
    initGame(game)
  else {
    moveTetri(game)
  }
}

exports.refresh = refresh