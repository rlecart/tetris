import { SYNC_HOME_DATA } from '../actions/homeAction.js';

const initialHomeState = {
  owner: undefined,
  profil: {
    name: '',
  },
  joinUrl: '',
};

const homeReducer = (state = initialHomeState, action) => {
  let nextState;

  switch (action.type) {
    case SYNC_HOME_DATA:
      console.log('ca sync')
      nextState = {
        ...state,
        ...action.value
      };
      return nextState;
    default:
      return state;
  }
};

export { initialHomeState };
export default homeReducer;