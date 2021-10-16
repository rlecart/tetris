import defaultRoom from "../ressources/defaultRoom.js";

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

export { initialRoomState };
export default roomReducer;