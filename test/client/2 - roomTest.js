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
import { addNewClients } from "../helpers/helpers.js";

import { setNewHomeInfo, } from '../../src/client/actions/homeAction.js';
import { SYNC_ROOM_DATA } from "../../src/client/actions/roomAction.js";

chai.use(chaiEnzyme());
Enzyme.configure({ adapter: new Adapter() });

describe('<Room /> component test', () => {
  let wrapper;
  let wrapper2;
  let master;
  let roomPath;
  let clients;
  const InvalidStore1 = createANewStore();
  const InvalidStore2 = createANewStore();
  const Store1 = createANewStore();
  const Store2 = createANewStore();
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
  const dispatchSpy = sinon.spy(Store1.dispatch);
  const dispatchSpy2 = sinon.spy(Store2.dispatch);

  Store1.dispatch = dispatchSpy;
  Store2.dispatch = dispatchSpy2;

  const RoomWithProvider = ({ store, history }) => (
    <Provider store={store}>
      <Room history={history} />
    </Provider>
  );

  before(async () => {
    master = new Master();
    await master.startServer();

    clients = addNewClients(2);

    setNewHomeInfo(Store1.dispatch, {
      newProfil: { name: 'nameTest' },
      newJoinUrl: 'joinUrlTest',
      newOwner: true,
    });
    addSocket(Store1.dispatch, clients[0]);
    addSocket(Store2.dispatch, clients[1]);
    await new Promise((res) => Store1.getState().socketReducer.socket.on('connect', () => {
      master.createRoom(Store1.getState().socketReducer.socket.id, Store1.getState().homeReducer.profil, (url) => {
        roomPath = url.value;
      });
      res();
    }));
    setNewHomeInfo(Store1.dispatch, {
      newProfil: { name: 'nameTest' },
      newJoinUrl: roomPath,
      newOwner: true,
    });
    setNewHomeInfo(Store2.dispatch, {
      newProfil: { name: 'nameTest2' },
      newJoinUrl: roomPath,
      newOwner: false,
    });
  });
  after(() => {
    master.stopServer();
  });

  describe('Can or can\'t stay here', () => {
    it('Can\'t stay here : can\'t get roomInfo (socket not connected)', async () => {
      wrapper = mount(<RoomWithProvider store={InvalidStore2} history={spyOnHistory} />);
      await new Promise((res) => setTimeout(res, 200))
        .then(() => expect(historySpy.push.calledOnce).to.be.true);
    });

    it('Can\'t stay here : can\'t get roomInfo (room doesn\'t exist)', async () => {
      wrapper = mount(<RoomWithProvider store={InvalidStore1} history={spyOnHistory} />);
      await new Promise((res) => setTimeout(res, 200))
        .then(() => expect(historySpy.push.calledTwice).to.be.true);
    });

    it('Should stay here', async () => {
      wrapper = mount(<RoomWithProvider store={Store1} history={spyOnHistory} />);
      await new Promise((res) => setTimeout(res, 100))
        .then(() => {
          expect(dispatchSpy.calledWithMatch(sinon.match({ type: SYNC_ROOM_DATA }))).to.be.true;
          expect(dispatchSpy.callCount).to.be.eql(4);
          expect(historySpy.push.calledThrice).to.be.false;
          wrapper.setProps({});
        });
    });
  });

  describe('Room behaviour', () => {
    it('Player 2 should join room', async () => {
      await new Promise((res) => {
        master.joinRoom(
          Store2.getState().socketReducer.socket.id,
          Store2.getState().homeReducer.profil,
          Store2.getState().homeReducer.joinUrl,
          (ret) => { res(); }
        );
      });
      wrapper2 = mount(<RoomWithProvider store={Store2} history={spyOnHistory} />);
      await new Promise((res) => setTimeout(res, 100))
        .then(() => {
          expect(Store2.getState().roomReducer.nbPlayer).to.be.eql(2);
          expect(dispatchSpy2.callCount).to.be.eql(3);
          expect(dispatchSpy2.calledWithMatch(sinon.match({ type: SYNC_ROOM_DATA }))).to.be.true;
          expect(historySpy.push.calledThrice).to.be.false;
          expect(Store1.getState().roomReducer).to.be.eql(Store2.getState().roomReducer);
        });
    });

    it('Owner should swap when Player 1 leaves', async () => {
      await new Promise((res) => setTimeout(res, 500))
        .then(() => {

          wrapper2.update();
          expect(wrapper2.find('.roomButton#launch')).to.exists;

          wrapper.find('.roomButton#leave').prop('onClick')();
        });
      await new Promise((res) => setTimeout(res, 500))
        .then(() => {
          wrapper2.update();
          expect(wrapper2.find('.roomButton#launch')).to.exists;
        });
    });
  });

});