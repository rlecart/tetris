const { defaultRoom } = require("../../ressources/room");
const { isEmpty } = require("../../misc/utils");

const initialRoomState = {
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

const roomReducer = (state = initialRoomState, action) => {
  let nextState;

  switch (action.type) {
    case 'SYNC_ROOM_DATA':
      nextState = {
        ...state,
        ...action.value
      };
      return (nextState);
    case 'DELETE_ROOM_DATA':
      return (initialRoomState);
    default:
      return (state);
  }
};

module.exports = { roomReducer, setNewRoomInfo, initialRoomState };