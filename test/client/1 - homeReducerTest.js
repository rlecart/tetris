import configureStore from '../../src/Store/configureStore.js';
import { expect } from 'chai';
import { homeReducer, initialHomeState, setNewHomeInfo } from '../../src/Store/Reducers/homeReducer.js';

describe('Home reducer tests', () => {
  let exampleOfUsername = 'bonjourLesAmis';
  let exampleOfJoinUrl = 'bonjourLaRoom';
  let exampleOfOwner = true;
  let store;

  before(() => {
    store = configureStore(homeReducer, undefined, {});
    store = configureStore(homeReducer, initialHomeState, {
      'SYNC_HOME_DATA': ({ dispatch, getState }) => {
        const state = getState();
        expect(state.profil.name).to.be.eql(exampleOfUsername);
        expect(state.joinUrl).to.be.eql(exampleOfJoinUrl);
        expect(state.owner).to.be.eql(exampleOfOwner);
      }
    });
  });

  it('Should be created', () => {
    const state = store.getState();
    expect(state).to.be.eql(initialHomeState);
  });

  it('Should update', () => {
    setNewHomeInfo(store.dispatch, {
      newProfil: { name: exampleOfUsername },
      newJoinUrl: exampleOfJoinUrl,
      newOwner: exampleOfOwner,
    });
  });

  it('Should not update', () => {
    store.dispatch({ type: 'SYNC_HOME_DATA' });
    store.dispatch({ type: 'DOESNT_EXIST', value: { joinUrl: 'nope' } });
  });

});