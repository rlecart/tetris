import configureStore from '../../src/Store/configureStore.js';
import { expect } from 'chai';
import { socketReducer, initialSocketState } from '../../src/Store/Reducers/socketReducer.js';
import openSocket from 'socket.io-client';

describe('Socket reducer tests', () => {
  let store;
  let socket;

  before(() => {
    socket = openSocket('http://localhost:8000');
    store = configureStore(socketReducer, undefined, {});
    store = configureStore(socketReducer, initialSocketState, {
      'CONNECT_SOCKET': ({ dispatch, getState }) => {
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
    store.dispatch({ type: 'CONNECT_SOCKET', value: socket });
  });

  it('Should not update', () => {
    store.dispatch({ type: 'CONNECT_SOCKET' });
    store.dispatch({ type: 'DOESNT_EXIST' });
  });

});