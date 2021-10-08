import { defaultRoom } from "../../ressources/room";
import { isEmpty } from "../../misc/utils";

const initialState = {
  ...defaultRoom,
};

const setNewRoomInfo = (dispatch, newRoomInfo) => {
  let action = {
    type: 'SYNC_ROOM_DATA',
    value: newRoomInfo,
  };

  if (!newRoomInfo || isEmpty(newRoomInfo))
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
          ...action.value
        };
        return (nextState || state);
      case 'DELETE_ROOM_DATA':
        return (initialState);
      default:
        return (state);
    }
  }
};

export { setNewRoomInfo };
export default roomReducer;