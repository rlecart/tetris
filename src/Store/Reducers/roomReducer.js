const initialState = {};

const roomReducer = (state = initialState, action) => {
  let nextState;

  if (action) {
    switch (action.type) {
      case 'SYNC_ROOM_DATA':
        nextState = {
          ...state,
          roomInfo: action.value
        };
        return nextState || state;
      default:
        return state;
    }
  }
};

export default roomReducer;