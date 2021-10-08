import { defaultGame } from '../../ressources/game';

const initialState = {
  ...defaultGame,
};

const gameReducer = (state = initialState, action) => {
  let nextState;

  if (action) {
    switch (action.type) {
      case 'SYNC_GAME_DATA':
        nextState = {
          ...state,
          ...action.value
        };
        return (nextState || state);
      case 'DELETE_GAME_DATA':
        return (initialState);
      case 'ADD_WINNER':
        nextState = {
          ...state,
          winner: { ...action.value },
        };
        return (nextState || state);
      default:
        return (state);
    }
  }
};

export default gameReducer;