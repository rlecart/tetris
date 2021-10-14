const { configureStore } = require('../../src/Store/configureStore.js');
const { expect } = require('chai');
const { gameReducer, initialGameState, setNewGameInfo } = require('../../src/Store/Reducers/gameReducer.js');
const Player = require('../../server/classes/Player');

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
      'SYNC_GAME_DATA': ({ dispatch, getState }) => {
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
    store.dispatch({ type: 'SYNC_GAME_DATA' });
    store.dispatch({ type: 'DOESNT_EXIST' });
  });

  it('Should add winner', () => {
    exampleOfWinner = 'abc';
    store.dispatch({ type: 'ADD_WINNER', value: { winner: exampleOfWinner } });
  });

  it('Should delete game data', () => {
    exampleOfLines = initialGameState.lines;
    exampleOfTetri = initialGameState.tetri;
    exampleOfIsWaiting = true;
    exampleOfPlaced = initialGameState.placed;
    exampleOfSpec = initialGameState.lines;
    exampleOfWinner = undefined;
    store.dispatch({ type: 'DELETE_GAME_DATA' });
  });

});