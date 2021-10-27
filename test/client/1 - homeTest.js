import chai, { expect, assert } from "chai";
import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import chaiEnzyme from 'chai-enzyme';
import { Provider } from 'react-redux';
import { combineReducers } from "redux";
import sinon from 'sinon';
import _ from 'lodash';

import configureStore from "../../src/client/middleware/configureStore.js";
import socketReducer from '../../src/client/reducers/socketReducer.js';
import homeReducer from "../../src/client/reducers/homeReducer.js";
import roomReducer from "../../src/client/reducers/roomReducer.js";
import gameReducer from "../../src/client/reducers/gameReducer.js";

import Home from '../../src/client/containers/HomeContainer.js';

const Store = configureStore(combineReducers({
  socketReducer,
  roomReducer,
  homeReducer,
  gameReducer,
}, undefined, {}));

const NewHome = (testHistory) => (
  <Provider store={Store}>
    <Home history={testHistory} />
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

  before(() => {
    console.log(Store.getState());
    socketBefore = _.cloneDeep(Store.getState().socketReducer.socket);
    wrapper = mount(<NewHome
      history={testToCallPush}
    />);
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

  it('Should succeed to Create Room', () => {
    // const historyPushSpy = sinon.spy(testToCallPush);
    // console.log(wrapper.find('button').at(0).prop('onClick'));
    // console.log('proto = ', form.prototype)
    // const submitFormSpy = sinon.spy(form.prototype, 'onSubmit');
    wrapper.find('[type="submit"]').get(0).click();
    // console.log('ca a submit = ', submitFormSpy.calledOnce);
    // const button = wrapper.find('button.roomButton').at(1);
    // button.simulate('click');
    // console.log(historyPushSpy);
    // console.log(historyPushSpy.push.calledOnce);
    // console.log(isPushCalled);
    // expect(historyPushSpy.push.calledOnce).to.be.true;
    // expect(isPushCalled).to.be.true;
    // expect(Home.prototype.submitForm.calledOnce).to.equal(true);
    // wrapper.should.have.html('<div>404</div>');
  });
});