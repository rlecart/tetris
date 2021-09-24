const initialState = {}

const homeReducer = (state = initialState, action) => {
  let nextState

  switch (action.type) {
    case 'SYNC_HOME_DATA':
      console.log(action.type)
      nextState = {
        ...state,
        home: action.value
      }
      console.log('nextState = ', nextState, '\n')
      return nextState || state
    default:
      return state
  }
}

export default homeReducer