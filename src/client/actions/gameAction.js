export const SYNC_GAME_DATA = 'SYNC_GAME_DATA';
export const DELETE_GAME_DATA = 'DELETE_GAME_DATA';
export const ADD_WINNER = 'ADD_WINNER';

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

export default { setNewGameInfo, deleteGameData, addWinner };