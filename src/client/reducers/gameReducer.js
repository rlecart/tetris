import {
  SYNC_GAME_DATA,
  DELETE_GAME_DATA,
  ADD_WINNER
} from '../actions/gameAction.js';
import defaultGame from '../ressources/defaultGame.js';

const initialGameState = {
  ...defaultGame,
};

const gameReducer = (state = initialGameState, action) => {
  let nextState;

  switch (action.type) {
    case SYNC_GAME_DATA:
      nextState = {
        ...state,
        ...action.value
      };
      return (nextState);
    case DELETE_GAME_DATA:
      return (initialGameState);
    case ADD_WINNER:
      nextState = {
        ...state,
        winner: { ...action.value },
      };
      return (nextState);
    default:
      return (state);
  }
};

export { initialGameState };
export default gameReducer;