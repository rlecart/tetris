const initialState = {};

const gameReducer = (state = initialState, action) => {
  let nextState;

  if (action) {
    switch (action.type) {
      case 'SYNC_GAME_DATA':
        nextState = {
          ...state,
          game: action.value
        };
        return nextState || state;
      case 'DELETE_GAME_INFO':
        nextState = {
          ...state,
          game: undefined,
          winner: undefined
        };
        return nextState || state;
      case 'ADD_WINNER':
        nextState = {
          ...state,
          winner: action.value
        };
        return nextState || state;
      default:
        return state;
    }
  }
};

export default gameReducer;