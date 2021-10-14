const initialHomeState = {
  owner: undefined,
  profil: {
    name: '',
  },
  joinUrl: '',
};

const setNewHomeInfo = (dispatch, newHomeInfo) => {
  let action = {
    type: 'SYNC_HOME_DATA',
    value: {
      profil: newHomeInfo.newProfil,
      joinUrl: newHomeInfo.newJoinUrl,
      owner: newHomeInfo.newOwner,
    },
  };
  dispatch(action);
};

const homeReducer = (state = initialHomeState, action) => {
  let nextState;

  switch (action.type) {
    case 'SYNC_HOME_DATA':
      nextState = {
        ...state,
        ...action.value
      };
      return nextState;
    default:
      return state;
  }
};

module.exports = { homeReducer, initialHomeState, setNewHomeInfo };