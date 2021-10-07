import { isEmpty } from "../../misc/utils";

const initialState = {};

const setNewRoomInfo = (dispatch, newRoomInfo, isAsked) => {
  let action = {
    type: 'SYNC_ROOM_DATA',
    value: newRoomInfo,
  };

  if ((!newRoomInfo || isEmpty(newRoomInfo)) && !isAsked)
    return (-1);
  dispatch(action);
};

const roomReducer = (state = initialState, action) => {
  let nextState;

  if (action) {
    switch (action.type) {
      case 'SYNC_ROOM_DATA':
        nextState = {
          ...state,
          roomInfo: action.value
        };
        return nextState || state;
      default:
        return state;
    }
  }
};

export { setNewRoomInfo };
export default roomReducer;