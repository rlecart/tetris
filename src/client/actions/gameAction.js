export const SYNC_GAME_DATA = 'SYNC_GAME_DATA';
export const DELETE_GAME_DATA = 'DELETE_GAME_DATA';
export const ADD_WINNER = 'ADD_WINNER';
export const ACID_MODE = 'ACID_MODE';
export const UPDATE_ACID_MODE = 'UPDATE_ACID_MODE';
export const STOP_ACID_MODE = 'STOP_ACID_MODE';

const setNewGameInfo = (dispatch, newGameInfo) => {
  let action = {
    type: 'SYNC_GAME_DATA',
    value: {
      lines: newGameInfo.lines,
      tetri: newGameInfo.tetri,
      isWaiting: newGameInfo.isWaiting,
      placed: newGameInfo.placed,
      spec: newGameInfo.spec,
    },
  };
  dispatch(action);
};

const deleteGameData = (dispatch) => {
  let action = { type: DELETE_GAME_DATA };
  dispatch(action);
};

const addWinner = (dispatch, winnerInfo) => {
  let action = {
    type: ADD_WINNER,
    value: winnerInfo
  };
  dispatch(action);
};

const acidMode = (dispatch) => {
  let action = {
    type: ACID_MODE,
    value: setInterval(() => dispatch({ type: UPDATE_ACID_MODE }), 50),
  };
  dispatch(action);
};

const stopAcidMode = (dispatch) => {
  let action = { type: STOP_ACID_MODE };
  dispatch(action);
};

export { setNewGameInfo, deleteGameData, addWinner, acidMode, stopAcidMode };