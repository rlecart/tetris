const initialState = {
  socket: {},
  areGameEventsLoaded: false,
}

function socketConnector(state = initialState, action) {
  let nextState

  if (action)
    console.log(action.type)
  switch (action.type) {
    case 'CONNECT_SOCKET':
      nextState = {
        ...state,
        socket: action.value
      }
      // console.log('nextState = ', nextState, '\n')
      return nextState || state
    case 'GAME_EVENTS_LOADED':
      nextState = {
        ...state,
        areGameEventsLoaded: true
      }
      return nextState || state
    default:
      return state
  }
}

export default socketConnector