const { defaultGame } = require('../../ressources/game');

const initialGameState = {
  ...defaultGame,
};

const gameReducer = (state = initialGameState, action) => {
  let nextState;

  switch (action.type) {
    case 'SYNC_GAME_DATA':
      nextState = {
        ...state,
        ...action.value
      };
      return (nextState || state);
    case 'DELETE_GAME_DATA':
      return (initialGameState);
    case 'ADD_WINNER':
      nextState = {
        ...state,
        winner: { ...action.value },
      };
      return (nextState || state);
    default:
      return (state);
  }
};

module.exports = { gameReducer, initialGameState };