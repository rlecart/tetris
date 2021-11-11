import { expect } from 'chai';
import defaultRules from '../../src/ressources/defaultRules.js';
import { io } from 'socket.io-client';
import params from '../../params.js';

import { combineReducers } from "redux";
import configureStore from "../../src/client/middleware/configureStore.js";
import socketReducer from '../../src/client/reducers/socketReducer.js';
import homeReducer from "../../src/client/reducers/homeReducer.js";
import roomReducer from "../../src/client/reducers/roomReducer.js";
import gameReducer from "../../src/client/reducers/gameReducer.js";

const expectNewRoom = (room, playerId) => {
  expect(room.isInGame()).to.be.eql(false);
  expect(room).to.exist;
  expect(room.getNbPlayer()).to.be.eql(1);
  expect(room.getRules()).to.be.eql(defaultRules);
  expect(room.getInterval()).to.be.eql(undefined);
  expect(room.getShapes()).to.be.eql([]);
  expect(room.getShapesId()).to.be.eql([]);
  expect(room.getReadyToStart()).to.be.eql({});
  expect(room.getReadyToStart()).to.be.eql({});
  expect(room.getOwner()).to.be.eql(playerId);
  expect(room.getArrivalOrder()).to.be.eql([playerId]);
};

const expectJoinRoom = (room, playerId, playerName, nbPlayer) => {
  let player = room.getListPlayers(playerId);

  expect(player.getId()).to.be.eql(playerId);
  expect(player.getProfil()).to.eql({
    ...playerName, url: room.getUrl(), owner: false
  });
  expect(room.getNbPlayer()).to.be.eql(nbPlayer);
};

const addNewClients = async (nb, addOn) => {
  let clients = [];
  let socket;
  let doneAlready = 0;
  let i = 0;

  console.log('nb = ', nb);
  await new Promise(res => {
    while (i < nb) {
      // console.log('i aa = ', i)
      // for (let i = 0; i < nb; i++) {
      // ;
      // await waitAMinute(10)
      socket = io(params.server.url, { multiplex: false });
      socket.on('connect', () => {
        if (addOn !== undefined) {
          for (let [key, value] of Object.entries(addOn))
            socket.on(key, value);
        }
        doneAlready++;
        if (doneAlready >= nb) {
          console.log('doneAlred = ', doneAlready);
          console.log('nb = ', nb);
          // console.log('ca done', i);
          // res();
          setTimeout(() => {
            console.log('donealresad', doneAlready);
            console.log('i = ', i);
            res();
          }, 4500);
        }
      });
      clients.push(socket);
      i++;
    }
  });
  console.log('finaldone', doneAlready);
  console.log('nb of duplicate = ', new Set(clients).length)
  return (clients);
};

const removeEveryClients = (master) => {
  return (new Promise(async res => {
    let i = 1;
    for (let client in master.getSioList()) {
      i++;
      await master.removeSio(client);
    }
    console.log(i);
    res();
  }));
};

const waitAMinute = (ms) => {
  return (new Promise(res => {
    setTimeout(() => res(), ms);
  }));
};


const createANewStore = () => {
  return (configureStore(combineReducers({
    socketReducer,
    roomReducer,
    homeReducer,
    gameReducer,
  }), undefined, {}));
};

export { expectNewRoom, expectJoinRoom, addNewClients, removeEveryClients, waitAMinute, createANewStore };
