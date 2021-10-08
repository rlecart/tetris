const initialState = {
  socket: undefined,
  // isSocketConnected: false,
};

function socketReducer(state = initialState, action) {
  let nextState;

  if (action) {
    switch (action.type) {
      case 'CONNECT_SOCKET':
        nextState = {
          ...state,
          socket: action.value,
          // isSocketConnected: true,
        };
        console.log('connect_socket', nextState);
        return nextState || state;
      default:
        return state;
    }
  }
}

export default socketReducer;