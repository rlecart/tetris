const initialState = {
  socket: {},
  areGameEventsLoaded: false,
  isSocketConnected: false,
};

function socketConnector(state = initialState, action) {
  let nextState;

  if (action) {
    switch (action.type) {
      case 'CONNECT_SOCKET':
        nextState = {
          ...state,
          socket: action.value,
          isSocketConnected: true,
        };
        return nextState || state;
      case 'GAME_EVENTS_LOADED':
        nextState = {
          ...state,
          areGameEventsLoaded: true
        };
        return nextState || state;
      case 'GAME_EVENTS_UNLOADED':
        nextState = {
          ...state,
          areGameEventsLoaded: false
        };
        return nextState || state;

      default:
        return state;
    }
  }
}

export default socketConnector;