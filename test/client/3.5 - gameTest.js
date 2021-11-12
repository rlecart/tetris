import chai, { expect } from "chai";
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import chaiEnzyme from 'chai-enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import _ from 'lodash';

import { createANewStore } from "../helpers/helpers.js";
import Game from '../../src/client/containers/GameContainer.js';
import Master from '../../src/server/classes/Master';
import { addSocket } from "../../src/client/actions/socketAction.js";
import { addNewClients } from "../helpers/helpers.js";

import { setNewHomeInfo } from '../../src/client/actions/homeAction.js';
import api from '../../src/client/api/clientApi';
import { setNewRoomInfo } from "../../src/client/actions/roomAction.js";

chai.use(chaiEnzyme());
Enzyme.configure({ adapter: new Adapter() });

describe('<Game /> component test', () => {
  let wrapper;
  let wrapper2;
  let master;
  let roomPath;
  let roomPath2;
  let clients;
  const InvalidStore1 = createANewStore();
  const InvalidStore2 = createANewStore();
  const Store1 = createANewStore();
  const Store2 = createANewStore();
  const spyOnHistory = {
    push(path) {
      if (path)
        roomPath2 = path.slice(2, path.indexOf('['));
    },
    replace(path) {
      roomPath2 = path;
    }
  };
  const historySpy = sinon.spy(spyOnHistory);
  const dispatchSpy = sinon.spy(Store1.dispatch);
  const dispatchSpy2 = sinon.spy(Store2.dispatch);

  Store1.dispatch = dispatchSpy;
  Store2.dispatch = dispatchSpy2;

  const GameWithProvider = ({ store, history }) => (
    <Provider store={store}>
      <Game history={history} />
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
    setNewHomeInfo(Store2.dispatch, {
      newProfil: { name: 'nameTest2' },
      newJoinUrl: 'joinUrlTest',
      newOwner: false,
    });
    addSocket(Store1.dispatch, clients[0]);
    addSocket(Store2.dispatch, clients[1]);
    await new Promise((res) => Store1.getState().socketReducer.socket.on('connect', () => {
      api.createRoom(Store1.getState().socketReducer.socket, Store1.getState().homeReducer.profil)
        .then((url) => {
          roomPath = url;
          api.getRoomInfo(Store1.getState().socketReducer.socket, roomPath)
            .then((newRoomInfo) => { setNewRoomInfo(Store1.dispatch, newRoomInfo); });
          res();
        });
    })).then(() => {
      api.joinRoom(Store2.getState().socketReducer.socket, Store2.getState().homeReducer.profil, roomPath)
        .then((url) => {
          api.getRoomInfo(Store2.getState().socketReducer.socket, roomPath)
            .then((newRoomInfo) => {
              setNewRoomInfo(Store2.dispatch, newRoomInfo);
            });
        });
    });
    setNewHomeInfo(Store1.dispatch, {
      newProfil: { name: 'nameTest' },
      newJoinUrl: roomPath,
      newOwner: true,
    });
    setNewHomeInfo(InvalidStore2.dispatch, {
      newProfil: { name: 'nameTest3' },
      newJoinUrl: 'bad',
      newOwner: false,
    });
  });
  after(() => {
    master.stopServer();
  });

  describe('Can or can\'t stay here', () => {
    it('Can\'t stay here : can\'t get roomInfo (socket not connected)', async () => {
      wrapper = mount(<GameWithProvider store={InvalidStore2} history={spyOnHistory} />);
      await new Promise((res) => setTimeout(res, 200))
        .then(() => expect(historySpy.push.calledOnce).to.be.true);
    });

    it('Can\'t stay here : can\'t get roomInfo (room doesn\'t exist)', async () => {
      wrapper = mount(<GameWithProvider store={InvalidStore1} history={spyOnHistory} />);
      await new Promise((res) => setTimeout(res, 200))
        .then(() => expect(historySpy.push.calledTwice).to.be.true);
    });

    it('Should stay here but not start', async () => {
      wrapper = mount(<GameWithProvider store={Store1} history={spyOnHistory} />);
      await new Promise((res) => setTimeout(res, 100))
        .then(() => {
          expect(wrapper.find('.board')).to.exists;
          expect(historySpy.push.calledThrice).to.be.false;
          expect(master.getRoom(roomPath).isInGame()).to.be.false;
        });
    });

    it('Should stay here and start', async () => {
      wrapper2 = mount(<GameWithProvider store={Store2} history={spyOnHistory} />);
      await new Promise((res) => setTimeout(res, 100))
        .then(() => {
          expect(wrapper.find('.board')).to.exists;
          expect(historySpy.push.calledThrice).to.be.false;
          expect(master.getRoom(roomPath).isInGame()).to.be.true;
        });
    });
  });

  describe('Game behaviour', () => {
    describe('Should move', () => {
      it('right', () => {
        const lineTmp = Store1.getState().gameReducer.lines;

        wrapper.update();
      });
    });
  });

});