const initialState = {
  owner: undefined,
  profil: {
    name: '',
  },
  joinUrl: '',
};

const homeReducer = (state = initialState, action) => {
  let nextState;

  if (action) {
    switch (action.type) {
      case 'SYNC_HOME_DATA':
        nextState = {
          ...state,
          ...action.value
        };
        return nextState || state;
      default:
        return state;
    }
  }
};

export default homeReducer;