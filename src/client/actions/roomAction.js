import { isEmpty } from "../misc/utils.js";

export const SYNC_ROOM_DATA = 'SYNC_ROOM_DATA';
export const DELETE_ROOM_DATA = 'DELETE_ROOM_DATA';

const setNewRoomInfo = (dispatch, newRoomInfo) => {
  let action = {
    type: SYNC_ROOM_DATA,
    value: newRoomInfo,
  };

  if (!newRoomInfo || isEmpty(newRoomInfo))
    return (-1);
  dispatch(action);
};

const deleteRoomData = (dispatch) => {
  let action = { type: DELETE_ROOM_DATA };
  dispatch(action);
};

export default { setNewRoomInfo, deleteRoomData };