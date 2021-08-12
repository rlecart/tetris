// const { anotherOnePlease } = require('../src/api.js')
const tetriminos = require('../src/ressources/tetriminos.js')

const newRand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const newShape = (room, rand) => {
  const i = rand % 6

  room.addShapesId(i + 2)
  return (tetriminos.tetriminos[i]) // deep clone ?
}

function initShapes(room) {
  // room.shapes = []
  // room.shapesId = []
  room.addNewShape(newShape(room, newRand(1, 6)))
  room.addNewShape(newShape(room, newRand(1, 6)))
  // room.shapes.push(newShape(room, newRand(1, 6)))
  // room.shapes.push(newShape(room, newRand(1, 6)))
}

const createNewTetri = (game, room) => { // c'etait pour le set et pas le creer avec -1 j'imagine
  game.addPlaced(1)
  if (game.getPlaced() >= room.getShapes().length - 1)
    room.addNewShape(newShape(room, newRand(1, 6)))
  game.setActualShape(room.getShapes(game.getPlaced()))
  game.setNextShape(room.getShapes(game.getPlaced() + 1))
  game.setId(room.getShapesId(game.getPlaced()))
  game.setNextId(room.getShapesId(game.getPlaced() + 1))
  game.setX(Math.trunc(game.getLines(0).length / 2 - game.getActualShape(0).length / 2))
  game.setY(-1)
}

const addTetri = (game) => {
  let i = -1;
  let j = -1;
  let x = game.getX()
  let y = game.getY()
  let id = game.getId()
  let actual = game.getActualShape()

  while (++i < actual.length) {
    while (++j < actual[0].length) {
      if (actual[i][j] === 1) {
        // console.log(x, y)
        // console.log(game.tetri)
        game.setLines(y, x, id)
      }
      x++
    }
    x = game.getX()
    j = -1;
    y++
  }
}

const checkTetri = (game, truePos) => {
  let i = -1;
  let j = -1;
  let x = game.getX()
  let y = game.getY()
  let actual = game.getActualShape()

  if (x + truePos.lengthX - 1 > game.getLines(0).length
    || y + truePos.lengthY - 1 > game.getLines().length)
    return (-1)
  while (++i < actual.length) {
    while (++j < actual[i].length) {
      if (actual[i][j] === 1 && game.getLines(y, x) !== 0) {
        return (-1)
      }
      x++
    }
    j = -1;
    x = game.getX()
    y++
  }
  // console.log('check ok\n')
  return (1)
}

const removeTetri = (game) => {
  let i = -1;
  let j = -1;
  let x = game.getX()
  let y = game.getY()
  let actual = game.getActualShape()

  while (++i < actual.length) {
    while (++j < actual[i].length) {
      if (actual[i][j] == 1)
        game.setLines(y, x, 0)
      x++
    }
    x = game.getX()
    j = -1;
    y++
  }
}

const noMoreSpace = (game) => {
  if (game.getY() > 0)
    return (true)
  return (false)
}

const turnTetri = (game, dir) => {
  if (game.getId() === 5) {
    // console.log(game.tetri.actualShape)
    return (1)
  }
  let tmp = game.getActualShape()

  if (dir)
    tmp = tmp.map((val, index) => tmp.map(row => row[index]).reverse())
  else
    tmp = tmp.map((val, index) => tmp.map(row => row[index])).reverse()

  // tmp[0] = [tetri[0][2], tetri[1][2], tetri[2][2]]
  // tmp[1] = [tetri[0][1], tetri[1][1], tetri[2][1]]
  // tmp[2] = [tetri[0][0], tetri[1][0], tetri[2][0]]
  // if (0)
  game.setActualShape(tmp)
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
  if (game.getId() === 5 && x === 0 && y === 0)
    return (0)
  if (game.getX() + truePos.x + x < 0
    || game.getX() + truePos.x + truePos.lengthX - 1 + x >= game.getLines(0).length) {
    return (0)
  }
  if (game.getY() + truePos.y + y < 0
    || game.getY() + truePos.y + truePos.lengthY - 1 + y >= game.getLines().length)
    return (1)
  if (x === 0 && y === 0
    && ((truePos.lengthX < truePos.lengthY && game.getX() + truePos.x + truePos.lengthX - 1 + truePos.lengthY - truePos.lengthX > game.getLines(0).length)
      || (truePos.lengthY < truePos.lengthX && game.getY() + truePos.y + truePos.lengthY - 1 + truePos.lengthX - truePos.lengthY > game.getLines().length))) {
    return (0)
  }
  return ('ok')
}

const moveTetri = (game, x, y) => {
  let truePos = parseTruePos(game.getActualShape())
  let errors = checkIfOk(game, x, y, truePos)
  if (x === 0 && y === 0) {
    // console.log(truePos)
    // console.log(game.tetri)
  }
  // console.log(game.tetri.x, game.tetri.y, truePos)
  if (errors !== 'ok') {
    // console.log(truePos)
    // console.log(game.getTetri())
    // console.log('errors = ', errors)
    return (errors)
  }
  if (game.getY() !== -1 || (y === 0 && x !== 0))
    removeTetri(game)
  if (x === 0 && y === 0)
    turnTetri(game, true)
  game.addY(y)
  game.addX(x)
  if (checkTetri(game, truePos) === -1) {
    if (noMoreSpace(game) === false) {
      // console.log(game, game.tetri)
      return (-1)//gameover
    }
    else {
      game.subY(y)
      game.subX(x)
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

  while (++i < game.getLines().length) {
    if (!(game.getLines(i).includes(0)) && !(game.getLines(i).includes(1))) {
      game.removeFilledLine(i)
      i--
      count++
    }
  }
  return (count)
}

const endGame = (room, id) => { // gameover
  // console.log(room)
  room.emitAll('endGame') // ici emitOnly plutot pour faire continuer les autres
  room.getParent().closeRoom(room)
}

function addFilledLine(room, exception, amount) {
  let players = room.getSioFromParent()

  for (let [key, value] of Object.entries(players)) {
    // console.log('haha = ', ++haha)
    if (key !== exception) {
      for (let i = 0; i < amount; i++) {
        // console.log('i = ', i)
        // console.log('room = ', room)
        // console.log('getlistplayers = ', room.getListPlayers(key))
        // console.log('getlistplayers = ', room.getListPlayers(key))
        if (room.getListPlayers(key).getGame().getLines(0).find((elem) => { elem !== 0 })) { // ca check si y'avait deja un bloc en [0;X] avant d'ajouter la ligne car si oui alors ca veut dire que le joueur en question a perdu donc fin de game, sinon bah ca continue
          room.emitOnly('endGame', key, this)
          break;
        }
        else {
          // console.log('else')
          if (room.getListPlayers(key).getGame().getY() === 0)
            refresh(room.getListPlayers(key).getGame(), room, key) // ici ca bug quand c'est tetri first line
          // console.log('apres refresh cas tetri first line')
          room.getListPlayers(key).getGame().subY(1)
          // console.log('apres subY')
          room.getListPlayers(key).getGame().fillLine()
          // console.log('apres fillLine')
          refresh(room.getListPlayers(key).getGame(), room, key)
          // console.log('apres refresh')
            // console.log('avant refreshvue')
            server.emitOnly('refreshVue', room.getUrl(), key, room.getListPlayers(key).getGame(), () => {
            // console.log('avant createspec')
            let ret = room.createSpecList(key)
            // console.log('createSpecList = ')
            console.log(ret)
            // console.log('fin')
            return (ret)
          })
        }
      }
    }
  }
}

function refresh(game, room, id) {
  let hasMoved = 0
  let filledLines = 0

  // console.log(game)
    //console.log('debut refresh')
    if (game.getPlaced() === -1)
    createNewTetri(game, room)
    //console.log('avant move')
    hasMoved = moveTetri(game, 0, 1)
    //console.log('apres move')
    if (hasMoved == -1) {
      //console.log('avant endgamee')
      endGame(room, id)
      //console.log('apres endgamee')
    }
  else if (hasMoved == 1) {
    //console.log('avant moved=1')
    if ((filledLines = checkFilledLine(game)) > 0)
      addFilledLine(room, id, filledLines)
    //console.log('avant createnewtetri')
    createNewTetri(game, room)
    //console.log('apres createnewtetri')
    //console.log('avant de relaunch refresh')
    refresh(game, room, id)
}
  //console.log('refresh finish')
  return (game)
}


exports.refresh = refresh
exports.moveTetri = moveTetri
exports.initShapes = initShapes