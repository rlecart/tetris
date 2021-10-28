import chai, { expect, assert } from "chai";
import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import chaiEnzyme from 'chai-enzyme';
import { Provider } from 'react-redux';
import { combineReducers } from "redux";
import sinon from 'sinon';
import _ from 'lodash';

import { waitFor } from '@testing-library/react';

import configureStore from "../../src/client/middleware/configureStore.js";
import socketReducer from '../../src/client/reducers/socketReducer.js';
import homeReducer from "../../src/client/reducers/homeReducer.js";
import roomReducer from "../../src/client/reducers/roomReducer.js";
import gameReducer from "../../src/client/reducers/gameReducer.js";
import { SYNC_HOME_DATA } from '../../src/client/actions/homeAction.js';

import Home from '../../src/client/containers/HomeContainer.js';

import Master from '../../src/server/classes/Master';

const Store = configureStore(combineReducers({
  socketReducer,
  roomReducer,
  homeReducer,
  gameReducer,
}), undefined, {
  SYNC_HOME_DATA: ({ dispatch, getState }) => {
  }
});

const NewHome = ({ history }) => (
  <Provider store={Store}>
    <Home history={history} />
  </Provider>
);

chai.should();
chai.use(chaiEnzyme());

Enzyme.configure({ adapter: new Adapter() });

let isPushCalled = false;

const testToCallPush = {
  push(path) {
    isPushCalled = true;
  }
};

describe.only('<Home /> component test', () => {
  let wrapper;
  let socketBefore;
  let server;
  let master;

  before(() => {
    master = new Master();
    master.startServer();
    server = master.getServer();

    console.log(Store.getState());
    socketBefore = _.cloneDeep(Store.getState().socketReducer.socket);
    wrapper = mount(<NewHome
      history={testToCallPush}
    />);
    console.log(Store.getState().socketReducer.socket.connected);
    // Store.getState().socketReducer.socket.on('connect', () => done);
  });
  after(() => {
    master.stopServer();
  });

  it('Should create socket', () => {
    expect(Store.getState().socketReducer.socket).to.not.be.eql(socketBefore);
  });

  it('Should fail to Create Room', () => {
  });

  it('Should update username', () => {
    const usernameBefore = _.cloneDeep(Store.getState().homeReducer.profil.name);
    const event = { target: { name: "name", value: "nameChangeTest" } };
    wrapper.find('.username').simulate('change', event);
    expect(Store.getState().homeReducer.profil.name).to.not.be.eql(usernameBefore);
  });

  it('Should update joinUrl', () => {
    const joinUrlBefore = _.cloneDeep(Store.getState().homeReducer.joinUrl);
    const event = { target: { name: "roomUrl", value: "joinRoomUrlTest" } };
    wrapper.find('.roomUrl').simulate('change', event);
    expect(Store.getState().homeReducer.joinUrl).to.not.be.eql(joinUrlBefore);
  });

  it('Should succeed to Create Room', async () => {
    const historyPushSpy = sinon.spy(testToCallPush);
    wrapper.find('.roomButton#createRoomButton').prop('onClick')();
    await wrapper.find('form').prop('onSubmit')({ preventDefault: () => { } });
    console.log('le pqfwush = ', historyPushSpy.push.calledOnce);
    console.log('isPushCalled = ', isPushCalled);
    expect(historyPushSpy.push.calledOnce).to.be.true;
    console.log('le pushsa = ', historyPushSpy.push.calledOnce);
    console.log('le pussh = ', historyPushSpy.push.calledOnce);
    console.log('le push = ', historyPushSpy.push.calledOnce);
    console.log('le pushd = ', historyPushSpy.push.calledOnce);
    console.log('le pufsh = ', historyPushSpy.push.calledOnce);
  });
});