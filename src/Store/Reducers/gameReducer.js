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
      default:
        return state;
    }
  }
};

export default gameReducer;