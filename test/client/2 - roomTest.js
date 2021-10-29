import chai, { expect, assert } from "chai";
import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import chaiEnzyme from 'chai-enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import _ from 'lodash';

import { createANewStore } from "../helpers/helpers.js";
import Room from '../../src/client/containers/RoomContainer.js';
import Master from '../../src/server/classes/Master';
import { addSocket } from "../../src/client/actions/socketAction.js";
import openSocket from 'socket.io-client';

import { setNewHomeInfo } from '../../src/client/actions/homeAction.js';

chai.should();
chai.use(chaiEnzyme());
Enzyme.configure({ adapter: new Adapter() });

describe.only('<Room /> component test', () => {
  let wrapper;
  let wrapper2;
  let master;
  let roomPath;
  const Store = createANewStore();
  const Store2 = createANewStore();
  const Store3 = createANewStore();
  const spyOnHistory = {
    push(path) {
      if (path)
        roomPath = path.slice(2, path.indexOf('['));
    },
    replace(path) {
      roomPath = path;
    }
  };
  const historySpy = sinon.spy(spyOnHistory);

  const RoomWithProvider = ({ store, history }) => (
    <Provider store={store}>
      <Room history={history} />
    </Provider>
  );

  before(async () => {
    master = new Master();
    await master.startServer();

    // console.log(Store.getState());
    // wrapper = mount(<RoomWithProvider store={Store} history={spyOnHistory} />);
    // wrapper2 = mount(<RoomWithProvider store={Store2} history={spyOnHistory} />);
    setNewHomeInfo(Store3.dispatch, {
      profil: { name: 'nameTest' },
      joinUrl: 'joinUrlTest',
      owner: true,
    });
    addSocket(Store3.dispatch, openSocket('http://0.0.0.0:3004'));
    await new Promise((res) => Store3.getState().socketReducer.socket.on('connect', () => res()));
  });
  after(() => {
    master.stopServer();
  });

  describe('Can or can\'t stay here', () => {
    it('Can\'t stay here : can\'t get roomInfo (socket not connected)', async () => {
      wrapper = mount(<RoomWithProvider store={Store2} history={spyOnHistory} />);
      await new Promise((res) => setTimeout(res, 200))
        .then(() => expect(historySpy.push.calledOnce).to.be.true);
    });

    it('Can\'t stay here : can\'t get roomInfo (room doesn\'t exist)', async () => {
      wrapper = mount(<RoomWithProvider store={Store} history={spyOnHistory} />);
      await new Promise((res) => setTimeout(res, 200))
        .then(() => expect(historySpy.push.calledTwice).to.be.true);
    });

    it('Should stay here', async () => {
      wrapper = mount(<RoomWithProvider store={Store3} history={spyOnHistory} />);
      await new Promise((res) => setTimeout(res, 1000))
        .then(() => expect(historySpy.push.calledThrice).to.be.false);
    });
  });
});