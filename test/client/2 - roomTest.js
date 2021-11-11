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

import { setNewHomeInfo, SYNC_HOME_DATA } from '../../src/client/actions/homeAction.js';
import { setNewRoomInfo, SYNC_ROOM_DATA } from "../../src/client/actions/roomAction.js";

chai.should();
chai.use(chaiEnzyme());
Enzyme.configure({ adapter: new Adapter() });

describe('<Room /> component test', () => {
  let wrapper;
  let wrapper2;
  let master;
  let roomPath;
  let clients;
  const Store = createANewStore();
  const Store2 = createANewStore();
  const Store3 = createANewStore();
  const Store4 = createANewStore();
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
  const dispatchSpy = sinon.spy(Store3.dispatch);
  const dispatchSpy2 = sinon.spy(Store4.dispatch);

  Store3.dispatch = dispatchSpy;
  Store4.dispatch = dispatchSpy2;

  const RoomWithProvider = ({ store, history }) => (
    <Provider store={store}>
      <Room history={history} />
    </Provider>
  );

  before(async () => {
    master = new Master();
    await master.startServer();

    clients = await addNewClients(2);

    setNewHomeInfo(Store3.dispatch, {
      newProfil: { name: 'nameTest' },
      newJoinUrl: 'joinUrlTest',
      newOwner: true,
    });
    addSocket(Store3.dispatch, clients[0]);
    addSocket(Store4.dispatch, clients[1]);
    await new Promise((res) => Store3.getState().socketReducer.socket.on('connect', () => {
      master.createRoom(Store3.getState().socketReducer.socket.id, Store3.getState().homeReducer.profil, (url) => {
        console.log('ca cb');
        roomPath = url.value;
      });
      res();
    }));
    setNewHomeInfo(Store3.dispatch, {
      newProfil: { name: 'nameTest' },
      newJoinUrl: roomPath,
      newOwner: true,
    });
    setNewHomeInfo(Store4.dispatch, {
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
      // console.log('store 4 = ');
      // console.log(Store4.getState().roomReducer);
      // console.log('store 3 = ');
      // console.log(Store3.getState().roomReducer);
      await new Promise((res) => {
        master.joinRoom(
          Store4.getState().socketReducer.socket.id,
          Store4.getState().homeReducer.profil,
          Store4.getState().homeReducer.joinUrl,
          (ret) => {
            // console.log(ret);
            res();
          }
        );
      });
      wrapper2 = mount(<RoomWithProvider store={Store4} history={spyOnHistory} />);
      await new Promise((res) => setTimeout(res, 100))
        .then(() => {
          expect(Store4.getState().roomReducer.nbPlayer).to.be.eql(2);
          expect(dispatchSpy2.callCount).to.be.eql(3);
          // console.log(dispatchSpy.printf("%D"));
          expect(dispatchSpy2.calledWithMatch(sinon.match({ type: SYNC_ROOM_DATA }))).to.be.true;
          expect(historySpy.push.calledThrice).to.be.false;
          // console.log(Store3.getState().roomReducer);
          // console.log(Store4.getState().roomReducer);
          expect(Store3.getState().roomReducer).to.be.eql(Store4.getState().roomReducer);
        });
    });

    it('Owner should swap when Player 1 leaves', async () => {
      await new Promise((res) => setTimeout(res, 500))
        .then(() => {

          wrapper2.update();
          // console.log('launch1 = ')
          // console.log(wrapper.find('.roomButton#launch').exists());
          // console.log('launch = ')
          // console.log(wrapper2.find('.roomButton#launch').exists());
          expect(wrapper2.find('.roomButton#launch')).to.exists;

          wrapper.find('.roomButton#leave').prop('onClick')();
        });
      // console.log(wrapper.find('.roomButton#leave').props());
      await new Promise((res) => setTimeout(res, 500))
        .then(() => {
          wrapper2.update();
          // console.log(wrapper2.find('.roomButton#launch').exists());
          expect(wrapper2.find('.roomButton#launch')).to.exists;
          // console.log(Store4.getState().roomReducer);
          // expect(dispatchSpy.callCount).to.be.eql(4);
          // expect(dispatchSpy.calledWithMatch(sinon.match({ type: SYNC_ROOM_DATA }))).to.be.true;
          // expect(Store4.getState().roomReducer.nbPlayer).to.be.eql(1);
          // expect(Store4.getState().roomReducer.listPlayers[Store4.getState().socketReducer.socket.id]).to.be.eql(Store4.getState().roomReducer.owner);
        });
    });
  });

});