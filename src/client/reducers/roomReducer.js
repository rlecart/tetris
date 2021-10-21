import defaultRoom from "../../ressources/defaultRoom.js";
import { SYNC_ROOM_DATA, DELETE_ROOM_DATA } from '../actions/roomAction.js';

const initialRoomState = {
  ...defaultRoom,
};

const roomReducer = (state = initialRoomState, action) => {
  let nextState;

  switch (action.type) {
    case SYNC_ROOM_DATA:
      nextState = {
        ...state,
        ...action.value
      };
      return (nextState);
    case DELETE_ROOM_DATA:
      return (initialRoomState);
    default:
      return (state);
  }
};

export { roomReducer, initialRoomState };
export default roomReducer;