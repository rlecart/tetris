import tetriminos from '../src/ressources/tetriminos.js';

const newRand = (min, max) => {
  return (Math.floor(Math.random() * (max - min + 1)) + min);
};

const newShape = (room, rand) => {
  const i = rand % tetriminos.length;

  room.addShapesId(i + 2);
  return (tetriminos[i]);
};

function initShapes(room) {
  room.addNewShape(newShape(room, newRand(1, tetriminos.length)));
  room.addNewShape(newShape(room, newRand(1, tetriminos.length)));
}

const createNewTetri = (game, room) => {
  game.addPlaced(1);
  if (game.getPlaced() >= room.getShapes().length - 1)
    room.addNewShape(newShape(room, newRand(1, tetriminos.length)));
  game.setActualShape(room.getShapes(game.getPlaced()));
  game.setNextShape(room.getShapes(game.getPlaced() + 1));
  game.setId(room.getShapesId(game.getPlaced()));
  game.setNextId(room.getShapesId(game.getPlaced() + 1));
  game.setX(Math.trunc(game.getLines(0).length / 2 - game.getActualShape(0).length / 2));
  game.setY(-1);
};

const addTetri = (game) => {
  let i = -1;
  let j = -1;
  let x = game.getX();
  let y = game.getY();
  let id = game.getId();
  let actual = game.getActualShape();

  while (++i < actual.length) {
    while (++j < actual[0].length) {
      if (actual[i][j] === 1)
        game.setLines(y, x, id);
      x++;
    }
    x = game.getX();
    j = -1;
    y++;
  }
};

const checkTetri = (game, truePos) => {
  let i = -1;
  let j = -1;
  let x = game.getX();
  let y = game.getY();
  let actual = game.getActualShape();

  if (x + truePos.x + truePos.lengthX > game.getLines(0).length
    || y + truePos.y + truePos.lengthY > game.getLines().length)
    return (-1);
  while (++i < actual.length && i <= truePos.y + truePos.lengthY - 1) {
    while (++j < actual[i].length && j <= truePos.x + truePos.lengthX - 1) {
      if (game.getY() + i >= game.getLines().length
        || (actual[i][j] === 1 && game.getLines(y, x) !== undefined && game.getLines(y, x) !== 0))
        return (-1);
      x++;
    }
    j = -1;
    x = game.getX();
    y++;
  }
  return (1);
};

const noMoreSpace = (game) => {
  if (game.getY() > 0)
    return (true);
  return (false);
};

const turnTetri = (game, dir) => {
  let tmp = game.getActualShape();

  if (game.getId() === 5)
    return (1);
  if (dir)
    tmp = tmp.map((val, index) => tmp.map(row => row[index]).reverse());
  else
    tmp = tmp.map((val, index) => tmp.map(row => row[index])).reverse();
  game.setActualShape(tmp);
  return (0);
};

const parseLen = (tab) => {
  let counterX = [0, 0, 0, 0];
  let counterY = [0, 0, 0, 0];
  let x = 0;
  let y = 0;
  let i = -1;
  let j = -1;

  while (++i < tab.length) {
    while (++j < tab[i].length) {
      if (tab[i][j] === 1) {
        counterX[j] = 1;
        counterY[i] = 1;
      }
    }
    j = -1;
  }
  for (let val of counterX) {
    if (val === 1)
      x++;
  }
  for (let val of counterY) {
    if (val === 1)
      y++;
  }
  return ([x, y]);
};

const parseTruePos = (tab) => {
  let x = tab[0].length;
  let y = tab.length;
  let lengthX = 0;
  let lengthY = 0;
  let i = -1;
  let j = -1;

  while (++i < tab.length) {
    while (++j < tab[i].length) {
      if (tab[i][j] === 1) {
        if (j < x)
          x = j;
        if (i < y)
          y = i;
      }
    }
    j = -1;
  }
  [lengthX, lengthY] = parseLen(tab);
  return ({ x, y, lengthX, lengthY });
};

const checkIfOk = (game, x, y, truePos) => {
  if (game.isWaiting())
    return (0);
  if (game.getId() === 5 && x === 0 && y === 0)
    return (0);
  if (game.getX() + truePos.x + x < 0
    || game.getX() + truePos.x + truePos.lengthX - 1 + x >= game.getLines(0).length) {
    return (0);
  }
  if (x === 0 && y === 0
    && ((truePos.lengthX < truePos.lengthY && game.getX() + truePos.x + truePos.lengthX - 1 > game.getLines(0).length)
      || (truePos.lengthY < truePos.lengthX && game.getY() + truePos.y + truePos.lengthY - 1 > game.getLines().length))) {
    return (0);
  }
  return ('ok');
};

const moveTetri = (game, x, y) => {
  let truePos;
  let errors;

  if (x === 0 && y === 0)
    turnTetri(game, true);
  truePos = parseTruePos(game.getActualShape());
  errors = checkIfOk(game, x, y, truePos);
  if (errors !== 'ok') {
    if (x === 0 && y === 0)
      turnTetri(game, false);
    return (errors);
  }
  game.addY(y);
  game.addX(x);
  if ((checkTetri(game, truePos)) === -1) {
    if ((x === 0 && y !== 0) && noMoreSpace(game) === false)
      return (-1);
    else {
      game.subY(y);
      game.subX(x);
      if (x === 0 && y === 0)
        turnTetri(game, false);
      if (x === 0) {
        if (x === 0 && y === 0)
          return (0);
        if (!game.isWaiting()) {
          game.setWaiting(true);
          addTetri(game);
        }
        return (1);
      }
    }
  }
  return (2);
};

const checkFilledLine = (game) => {
  let i = -1;
  let count = 0;

  while (++i < game.getLines().length) {
    if (!(game.getLines(i).includes(0)) && !(game.getLines(i).includes(1))) {
      game.removeFilledLine(i);
      i--;
      count++;
    }
  }
  return (count);
};

const endGame = (room, id, res) => {
  room.emitOnly('endGame', id);
  room.addOut(id);
  // if (res !== undefined)
  //   res();
};

function addFilledLine(room, exception, amount) {
  let players = room.getSio();

  for (let id of Object.keys(players)) {
    if (id !== exception && !room.isOut(id)) {
      for (let i = 0; i < amount; i++) {
        if (room.getListPlayers(id).getGame().getLines(0).find((elem) => { elem !== 0; })) {
          endGame(room, id);
          break;
        }
        else {
          if (room.getListPlayers(id).getGame().getY() === 0)
            refresh(room.getListPlayers(id).getGame(), room, id);
          room.getListPlayers(id).getGame().subY(1);
          room.getListPlayers(id).getGame().fillLine();
          refresh(room.getListPlayers(id).getGame(), room, id);
          room.emitOnly('refreshVue', id, room.getListPlayers(id).getGame().formatIt(), room.createSpecList(id));
        }
      }
    }
  }
}

function refresh(game, room, id) {
  let hasMoved = 0;
  let filledLines = 0;

  game.setWaiting(false);
  if (game.getPlaced() === -1)
    createNewTetri(game, room);
  hasMoved = moveTetri(game, 0, 1);
  if (hasMoved == -1)
    endGame(room, id);
  else if (hasMoved == 1) {
    if ((filledLines = checkFilledLine(game)) > 0)
      addFilledLine(room, id, filledLines);
    game.refreshSpec(game.getLines());
    createNewTetri(game, room);
    refresh(game, room, id);
  }
  return (game);
}


export { refresh, moveTetri, initShapes, endGame, addTetri };