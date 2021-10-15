import defaultGame from '../../ressources/game.js';

const initialGameState = {
  ...defaultGame,
};

const setNewGameInfo = (dispatch, newGameInfo) => {
  let action = {
    type: 'SYNC_GAME_DATA',
    value: {
      lines: newGameInfo.lines,
      tetri: newGameInfo.tetri,
      isWaiting: newGameInfo.isWaiting,
      placed: newGameInfo.placed,
      spec: newGameInfo.spec,
    },
  };
  dispatch(action);
};

const gameReducer = (state = initialGameState, action) => {
  let nextState;

  switch (action.type) {
    case 'SYNC_GAME_DATA':
      nextState = {
        ...state,
        ...action.value
      };
      return (nextState);
    case 'DELETE_GAME_DATA':
      return (initialGameState);
    case 'ADD_WINNER':
      nextState = {
        ...state,
        winner: { ...action.value },
      };
      return (nextState);
    default:
      return (state);
  }
};

export default gameReducer;
export { gameReducer, initialGameState, setNewGameInfo };