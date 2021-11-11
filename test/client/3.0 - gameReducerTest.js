import configureStore from '../../src/client/middleware/configureStore.js';
import { expect } from 'chai';
import { gameReducer, initialGameState } from '../../src/client/reducers/gameReducer.js';
import { setNewGameInfo, addWinner, deleteGameData, SYNC_GAME_DATA, DELETE_GAME_DATA, ADD_WINNER, acidMode, stopAcidMode } from '../../src/client/actions/gameAction.js';
import { waitAMinute } from '../helpers/helpers';

describe('Game reducer tests', () => {
  let exampleOfLines = initialGameState.lines;
  let exampleOfTetri = initialGameState.tetri;
  let exampleOfIsWaiting = true;
  let exampleOfPlaced = initialGameState.placed;
  let exampleOfSpec = initialGameState.lines;
  let exampleOfWinner = undefined;
  let store;

  before(() => {
    store = configureStore(gameReducer, undefined, {});
    store = configureStore(gameReducer, initialGameState, {
      SYNC_GAME_DATA: ({ dispatch, getState }) => {
        const state = getState();
        expect(state.lines).to.be.eql(exampleOfLines);
        expect(state.tetri).to.be.eql(exampleOfTetri);
        expect(state.isWaiting).to.be.eql(exampleOfIsWaiting);
        expect(state.placed).to.be.eql(exampleOfPlaced);
        expect(state.spec).to.be.eql(exampleOfSpec);
        expect(state.winner).to.be.eql(exampleOfWinner);
      }
    });
  });

  it('Should be created', () => {
    const state = store.getState();
    expect(state).to.be.eql(initialGameState);
  });

  it('Should update', () => {
    setNewGameInfo(store.dispatch, {
      lines: exampleOfLines,
      tetri: exampleOfTetri,
      isWaiting: exampleOfIsWaiting,
      placed: exampleOfPlaced,
      spec: exampleOfSpec,
    });
  });

  it('Should not update', () => {
    store.dispatch({ type: SYNC_GAME_DATA });
    store.dispatch({ type: 'DOESNT_EXIST' });
  });

  it('Should add winner', () => {
    exampleOfWinner = 'abc';
    addWinner(store.dispatch, { winner: exampleOfWinner });
    // store.dispatch({ type: ADD_WINNER, value: { winner: exampleOfWinner } });
  });

  it('Should activate acid mode', () => {
    acidMode(store.dispatch);
    expect(store.getState().isInAcid).to.be.true;
    expect(store.getState().acidInterval).to.not.be.undefined;
  });

  it('Should desactivate acid mode', () => {
    stopAcidMode(store.dispatch);
    expect(store.getState().isInAcid).to.be.false;
    expect(store.getState().acidInterval).to.be.undefined;
    setNewGameInfo(store.dispatch, initialGameState);
  });

  it('Should delete game data', () => {
    exampleOfLines = initialGameState.lines;
    exampleOfTetri = initialGameState.tetri;
    exampleOfIsWaiting = true;
    exampleOfPlaced = initialGameState.placed;
    exampleOfSpec = initialGameState.lines;
    exampleOfWinner = undefined;
    deleteGameData(store.dispatch);
  });
});