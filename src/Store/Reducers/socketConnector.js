const initialState = { socket: {} }

function socketConnector(state = initialState, action) {
  let nextState

  switch (action.type) {
    case 'CONNECT_SOCKET':
      console.log('CONNECT_SOCKET')
      nextState = {
        ...state,
        socket: action.value
      }
      console.log('nextState = ', nextState, '\n')
      return nextState || state
    default:
      return state
  }
}

export default socketConnector