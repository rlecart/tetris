import {
  SYNC_GAME_DATA,
  DELETE_GAME_DATA,
  ADD_WINNER,
  ACID_MODE,
  UPDATE_ACID_MODE,
  STOP_ACID_MODE,
} from '../actions/gameAction.js';
import defaultGame from '../../ressources/defaultGame.js';

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
    case UPDATE_ACID_MODE:
      let newDisplayLines = state.lines;

      for (let line in newDisplayLines)
        for (let char in newDisplayLines[line])
          newDisplayLines[line][char] = (newDisplayLines[line][char] + 1) % 9;
      nextState = {
        ...state,
        lines: newDisplayLines,
      };
      return (nextState);
    case ACID_MODE:
      let nextIsInAcid = state.isInAcid;
      let nextAcidInterval = state.acidInterval;

      if (!state.isInAcid) {
        nextIsInAcid = true;
        nextAcidInterval = action.value;
      }
      else {
        clearInterval(action.value);
        clearInterval(state.acidInterval);
        nextIsInAcid = false;
        nextAcidInterval = undefined;
      }
      nextState = {
        ...state,
        isInAcid: nextIsInAcid,
        acidInterval: nextAcidInterval,
      };
      return (nextState);
    case STOP_ACID_MODE:
      clearInterval(state.acidInterval);
      nextIsInAcid = false;
      nextAcidInterval = undefined;
      nextState = {
        ...state,
        isInAcid: nextIsInAcid,
        acidInterval: nextAcidInterval,
      };
    default:
      return (state);
  }
};

export { gameReducer, initialGameState };
export default gameReducer;