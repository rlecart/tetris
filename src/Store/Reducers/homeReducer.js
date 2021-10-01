const initialState = {};

const homeReducer = (state = initialState, action) => {
  let nextState;

  if (action) {
    switch (action.type) {
      case 'SYNC_HOME_DATA':
        nextState = {
          ...state,
          home: action.value
        };
        return nextState || state;
      default:
        return state;
    }
  }
};

export default homeReducer;