import configureStore from '../../src/client/middleware/configureStore.js';
import { expect } from 'chai';
import { roomReducer, initialRoomState } from '../../src/client/reducers/roomReducer.js';
import { setNewRoomInfo, SYNC_ROOM_DATA, DELETE_ROOM_DATA } from '../../src/client/actions/roomAction.js'
import Player from '../../src/server/classes/Player.js';

describe('Room reducer tests', () => {
  let exampleOfUrl = '12hui235';
  let exampleOfInGame = true;
  let exampleOfNbPlayer = 7;
  let exampleOfListPlayers = {
    'abcdef': new Player({ name: 'bjr' }, 'abcdef')
  };
  let store;

  before(() => {
    store = configureStore(roomReducer, undefined, {});
    store = configureStore(roomReducer, initialRoomState, {
      SYNC_ROOM_DATA: ({ dispatch, getState }) => {
        const state = getState();
        expect(state.url).to.be.eql(exampleOfUrl);
        expect(state.inGame).to.be.eql(exampleOfInGame);
        expect(state.nbPlayer).to.be.eql(exampleOfNbPlayer);
        expect(state.listPlayers).to.be.eql(exampleOfListPlayers);
      }
    });
  });

  it('Should be created', () => {
    const state = store.getState();
    expect(state).to.be.eql(initialRoomState);
  });

  it('Should update', () => {
    setNewRoomInfo(store.dispatch, {
      url: exampleOfUrl,
      inGame: exampleOfInGame,
      nbPlayer: exampleOfNbPlayer,
      listPlayers: exampleOfListPlayers,
    });
  });

  it('Should not update', () => {
    store.dispatch({ type: SYNC_ROOM_DATA });
    store.dispatch({ type: 'DOESNT_EXIST' });
    expect(setNewRoomInfo(store.dispatch, undefined)).to.be.equal(-1);
    expect(setNewRoomInfo(store.dispatch, {})).to.be.equal(-1);
  });

  it('Should delete room data', () => {
    exampleOfUrl = initialRoomState.url;
    exampleOfInGame = initialRoomState.inGame;
    exampleOfNbPlayer = initialRoomState.nbPlayer;
    exampleOfListPlayers = initialRoomState.listPlayers;
    store.dispatch({ type: DELETE_ROOM_DATA });
  });

});