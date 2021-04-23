const initialState = {}

const roomReducer = (state = initialState, action) => {
  let nextState

  switch (action.type) {
    case 'SYNC_ROOM_DATA':
      console.log(action.type)
      nextState = {
        ...state,
        roomInfo: action.value
      }
      console.log('nextState = ', nextState, '\n')
      return nextState || state
    default:
      return state
  }
}

export default roomReducer