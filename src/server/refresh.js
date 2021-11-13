import defaultTetriminos from '../ressources/defaultTetriminos.js';

const newRand = (min, max) => {
  return (Math.floor(Math.random() * (max - min + 1)) + min);
};

const newShape = (room, rand) => {
  const i = rand % defaultTetriminos.length;

  room.addShapesId(i + 2);
  return (defaultTetriminos[i]);
};

function initShapes(room) {
  room.addNewShape(newShape(room, newRand(1, defaultTetriminos.length)));
  room.addNewShape(newShape(room, newRand(1, defaultTetriminos.length)));
}

const createNewTetri = (game, room) => {
  game.placed += 1;
  if (game.placed >= room.shapes.length - 1)
    room.addNewShape(newShape(room, newRand(1, defaultTetriminos.length)));
  game.tetri.actualShape = room.shapes[game.placed];
  game.tetri.nextShape = room.shapes[game.placed + 1];
  game.tetri.id = room.shapesId[game.placed];
  game.tetri.nextId = room.shapesId[game.placed + 1];
  game.tetri.x = Math.trunc(game.lines[0].length / 2 - game.tetri.actualShape[0].length / 2);
  game.tetri.y = -1;
};

const addTetri = (game) => {
  let i = -1;
  let j = -1;
  let x = game.tetri.x;
  let y = game.tetri.y;
  let id = game.tetri.id;
  let actual = game.tetri.actualShape;

  while (++i < actual.length) {
    while (++j < actual[0].length) {
      if (actual[i][j] === 1 && game.lines[y] !== undefined && game.lines[y][x] !== undefined)
        game.lines[y][x] = id;
      x++;
    }
    x = game.tetri.x;
    j = -1;
    y++;
  }
};

const checkTetri = (game, truePos) => {
  let i = -1;
  let j = -1;
  let x = game.tetri.x;
  let y = game.tetri.y;
  let actual = game.tetri.actualShape;

  if (x + truePos.x + truePos.lengthX > game.lines[0].length
    || y + truePos.y + truePos.lengthY > game.lines.length)
    return (-1);
  while (++i < actual.length && i <= truePos.y + truePos.lengthY - 1) {
    while (++j < actual[i].length && j <= truePos.x + truePos.lengthX - 1) {
      if (game.tetri.y + i >= game.lines.length
        || (actual[i][j] === 1 && game.lines[y] && game.lines[y][x] && game.lines[y][x] !== 0))
        return (-1);
      x++;
    }
    j = -1;
    x = game.tetri.x;
    y++;
  }
  return (1);
};

const noMoreSpace = (game) => {
  if (game.tetri.y > 0)
    return (true);
  return (false);
};

const turnTetri = (game, dir) => {
  let tmp = game.tetri.actualShape;

  if (game.tetri.id === 5)
    return (1);
  if (dir)
    tmp = tmp.map((val, index) => tmp.map(row => row[index]).reverse());
  else
    tmp = tmp.map((val, index) => tmp.map(row => row[index])).reverse();
  game.tetri.actualShape = tmp;
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
  if (game.isWaiting)
    return (0);
  if (game.tetri.id === 5 && x === 0 && y === 0)
    return (0);
  if (game.tetri.x + truePos.x + x < 0
    || game.tetri.x + truePos.x + truePos.lengthX - 1 + x >= game.lines[0].length) {
    return (0);
  }
  if (x === 0 && y === 0
    && ((truePos.lengthX < truePos.lengthY && game.tetri.x + truePos.x + truePos.lengthX - 1 > game.lines[0].length)
      || (truePos.lengthY < truePos.lengthX && game.tetri.y + truePos.y + truePos.lengthY - 1 > game.lines.length))) {
    return (0);
  }
  return ('ok');
};

const moveTetri = (game, x, y) => {
  let truePos;
  let errors;

  if (x === 0 && y === 0)
    turnTetri(game, true);
  truePos = parseTruePos(game.tetri.actualShape);
  errors = checkIfOk(game, x, y, truePos);
  if (errors !== 'ok') {
    if (x === 0 && y === 0)
      turnTetri(game, false);
    return (errors);
  }
  game.tetri.y += y;
  game.tetri.x += x;
  if ((checkTetri(game, truePos)) === -1) {
    if ((x === 0 && y !== 0) && noMoreSpace(game) === false)
      return (-1);
    else {
      game.tetri.y -= y;
      game.tetri.x -= x;
      if (x === 0 && y === 0)
        turnTetri(game, false);
      if (x === 0) {
        if (x === 0 && y === 0)
          return (0);
        if (!game.isWaiting) {
          game.isWaiting = true;
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

  while (++i < game.lines.length) {
    if (!(game.lines[i].includes(0)) && !(game.lines[i].includes(1))) {
      game.removeFilledLine(i);
      i--;
      count++;
    }
  }
  return (count);
};

const endGame = (room, id) => {
  room.addOut(id);
  room.emitOnly('endGame', id);
};

function addFilledLine(room, exception, amount) {
  let players = room.sioList;

  for (let id of Object.keys(players)) {
    if (id !== exception && !room.isOut[id]) {
      for (let i = 0; i < amount; i++) {
        if (room.listPlayers[id].game.lines[0].find((elem) => { elem !== 0; })) {
          endGame(room, id);
          break;
        }
        else {
          if (room.listPlayers[id].game.tetri.y === 0)
            refresh(room.listPlayers[id].game, room, id);
          room.listPlayers[id].game.tetri.y -= 1;
          room.listPlayers[id].game.fillLine();
          refresh(room.listPlayers[id].game, room, id);
          room.emitOnly('refreshVue', id, room.listPlayers[id].game.formated, room.createSpecList(id));
        }
      }
    }
  }
}

function refresh(game, room, id) {
  let hasMoved = 0;
  let filledLines = 0;

  game.isWaiting = false;
  if (game.placed === -1)
    createNewTetri(game, room);
  hasMoved = moveTetri(game, 0, 1);
  if (hasMoved == -1)
    endGame(room, id);
  else if (hasMoved == 1) {
    if ((filledLines = checkFilledLine(game)) > 0)
      addFilledLine(room, id, filledLines);
    game.refreshSpec(game.lines);
    createNewTetri(game, room);
    refresh(game, room, id);
  }
  return (game);
}


export { refresh, moveTetri, initShapes, endGame, addTetri };