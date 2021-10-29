import chai, { expect, assert } from "chai";
import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import chaiEnzyme from 'chai-enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import _ from 'lodash';

import { createANewStore } from "../helpers/helpers.js";
import Home from '../../src/client/containers/HomeContainer.js';
import Master from '../../src/server/classes/Master';

chai.should();
chai.use(chaiEnzyme());
Enzyme.configure({ adapter: new Adapter() });

describe('<Home /> component test', () => {
  let wrapper;
  let wrapper2;
  let socketBefore;
  let server;
  let master;
  let roomPath;
  const testToCallPush = {
    push(path) {
      if (path)
        roomPath = path.slice(2, path.indexOf('['));
    }
  };
  const historyPushSpy = sinon.spy(testToCallPush);
  const Store = createANewStore();
  const Store2 = createANewStore();

  const HomeWithProvider = ({ store, history }) => (
    <Provider store={store}>
      <Home history={history} />
    </Provider>
  );

  before(async () => {
    master = new Master();
    master.startServer();
    server = master.getServer();

    // console.log(Store.getState());
    socketBefore = _.cloneDeep(Store.getState().socketReducer.socket);
    wrapper = mount(<HomeWithProvider store={Store} history={testToCallPush} />);
    wrapper2 = mount(<HomeWithProvider store={Store2} history={testToCallPush} />);
    await new Promise((res) => Store.getState().socketReducer.socket.on('connect', () => res()));
  });
  after(() => {
    master.stopServer();
  });

  it('Should create socket', () => {
    expect(Store.getState().socketReducer.socket).to.not.be.eql(socketBefore);
  });

  it('Should fail to submit', async () => {
    await wrapper.find('form').prop('onSubmit')({ preventDefault: () => { } });
    expect(historyPushSpy.push.calledOnce).to.be.false;
  });

  it('Should fail to Create Room', async () => {
    wrapper.find('.roomButton#createRoomButton').prop('onClick')();
    wrapper.update();
    await wrapper.find('form').prop('onSubmit')({ preventDefault: () => { } })
      .catch((err) => {
        expect(err).to.be.eql('bad profil or clienId');
        expect(historyPushSpy.push.calledOnce).to.be.false;
      });
  });

  it('Should fail to Join Room', async () => {
    wrapper.find('.roomButton#joinRoomButton').prop('onClick')();
    wrapper.update();
    await wrapper.find('form').prop('onSubmit')({ preventDefault: () => { } })
      .catch((err) => {
        expect(err).to.be.eql('bad profil or clienId');
        expect(historyPushSpy.push.calledOnce).to.be.false;
      });
  });

  it('Should fail to update username and roomUrl', () => {
    const usernameBefore = _.cloneDeep(Store.getState().homeReducer.profil.name);
    const joinUrlBefore = _.cloneDeep(Store.getState().homeReducer.joinUrl);
    const event = { target: { name: "doesntExist", value: "aaaaa" } };
    wrapper.find('.username').simulate('change', event);
    wrapper.find('.roomUrl').simulate('change', event);
    expect(Store.getState().homeReducer.joinUrl).to.be.eql(joinUrlBefore);
    expect(Store.getState().homeReducer.profil.name).to.be.eql(usernameBefore);
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
    wrapper.find('.roomButton#createRoomButton').prop('onClick')();
    wrapper.update();
    await wrapper.find('form').prop('onSubmit')({ preventDefault: () => { } });
    expect(historyPushSpy.push.calledOnce).to.be.true;
  });

  it('Should succeed to Join Room (2nd client)', async () => {
    console.log('roomPath = ', roomPath);
    const usernameEvent = { target: { name: "name", value: "nameChangeTest2" } };
    wrapper2.find('.username').simulate('change', usernameEvent);
    wrapper2.update();
    const urlEvent = { target: { name: "roomUrl", value: roomPath } };
    wrapper2.find('.roomUrl').simulate('change', urlEvent);
    wrapper2.update();
    wrapper2.find('.roomButton#joinRoomButton').prop('onClick')();
    wrapper2.update();
    await wrapper2.find('form').prop('onSubmit')({ preventDefault: () => { } });
    expect(historyPushSpy.push.calledTwice).to.be.true;
  });
});