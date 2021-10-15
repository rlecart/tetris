const initialSocketState = {
  socket: undefined,
};

const socketReducer = (state = initialSocketState, action) => {
  let nextState;

  switch (action.type) {
    case 'CONNECT_SOCKET':
      nextState = {
        ...state,
        socket: action.value,
      };
      return (nextState);
    default:
      return (state);
  }
};

export default socketReducer;
export { socketReducer, initialSocketState };