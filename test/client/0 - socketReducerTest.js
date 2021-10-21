import configureStore from '../../src/client/middleware/configureStore.js';
import { expect } from 'chai';
import { socketReducer, initialSocketState } from '../../src/client/reducers/socketReducer.js';
import openSocket from 'socket.io-client';
import params from '../../params.js';
import { addSocket, CONNECT_SOCKET } from '../../src/client/actions/socketAction.js';

describe('Socket reducer tests', () => {
  let store;
  let socket;

  before(() => {
    socket = openSocket(params.server.url);
    store = configureStore(socketReducer, undefined, {});
    store = configureStore(socketReducer, initialSocketState, {
      CONNECT_SOCKET: ({ dispatch, getState }) => {
        const state = getState();
        expect(state.socket).to.be.eql(socket);
      }
    });
  });

  after(() => socket.disconnect());

  it('Should be created', () => {
    const state = store.getState();
    expect(state).to.be.eql(initialSocketState);
  });

  it('Should update', () => {
    addSocket(store.dispatch, socket);
  });

  it('Should not update', () => {
    addSocket(store.dispatch, undefined);
    store.dispatch({ type: 'DOESNT_EXIST' });
  });

});