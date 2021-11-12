import chai, { expect, assert } from "chai";
import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import chaiEnzyme from 'chai-enzyme';
import _ from 'lodash';

import GameOverContainer from '../../src/client/containers/GameOverContainer.js';

import defaultGame from '../../src/ressources/defaultGame';
import sinon from "sinon";

chai.should();
chai.use(chaiEnzyme());
Enzyme.configure({ adapter: new Adapter() });

describe('<GameOverContainer /> test', () => {
  let wrapper;
  let socketReducer;
  let roomReducer;
  let gameReducer;
  let showGoBack;
  let api;
  let pleaseUnmountGame;
  let history;

  describe('No render', () => {
    it('Should not renders (props undefined)', () => {
      wrapper = mount(
        <GameOverContainer
          socketReducer={socketReducer}
          roomReducer={roomReducer}
          gameReducer={gameReducer}
          showGoBack={showGoBack}
          api={api}
          pleaseUnmountGame={pleaseUnmountGame}
          history={history}
        />);
      expect(wrapper.find('GameOver').exists()).to.be.false;
    });
  });

  describe('Render', () => {
    let idToTest;
    let nameToTest;

    before(() => {
      idToTest = 'socketIdTest';
      nameToTest = 'nameTest';
      socketReducer = { socket: { id: idToTest } };
      roomReducer = {
        owner: idToTest,
        url: 'urlTest',
        listPlayers: { [idToTest]: { _profil: { name: nameToTest } } }
      };
      gameReducer = { winner: {} };
      showGoBack = true;
    });

    it('Should renders (valid props', () => {
      wrapper = mount(
        <GameOverContainer
          socketReducer={socketReducer}
          roomReducer={roomReducer}
          gameReducer={gameReducer}
          showGoBack={showGoBack}
          api={api}
          pleaseUnmountGame={pleaseUnmountGame}
          history={history}
        />);
      expect(wrapper.find('GameOver').exists()).to.be.true;
    });

    it('Should renders <LeaveButton /> (owner vue, no winner)', () => {
      expect(wrapper.find('LeaveButton').text()).to.eql('flex');
    });

    it('Should renders <LeaveButton /> (not owner vue no winner)', () => {
      roomReducer = { ...roomReducer, owner: 'anotherId' };
      wrapper = mount(
        <GameOverContainer
          socketReducer={socketReducer}
          roomReducer={roomReducer}
          gameReducer={gameReducer}
          showGoBack={showGoBack}
          api={api}
          pleaseUnmountGame={pleaseUnmountGame}
          history={history}
        />);
      expect(wrapper.find('LeaveButton').text()).to.eql('Go back');
    });

    it('Should renders <LeaveButton /> (owner vue, with winner)', () => {
      roomReducer = { ...roomReducer, owner: idToTest };
      gameReducer = {
        winner: {
          id: idToTest,
          name: nameToTest
        }
      };
      wrapper = mount(
        <GameOverContainer
          socketReducer={socketReducer}
          roomReducer={roomReducer}
          gameReducer={gameReducer}
          showGoBack={showGoBack}
          api={api}
          pleaseUnmountGame={pleaseUnmountGame}
          history={history}
        />);
      expect(wrapper.find('LeaveButton').text()).to.eql('Return to room');
    });

    it('Should renders <LeaveButton /> (not owner vue with winner)', () => {
      roomReducer = { ...roomReducer, owner: 'anotherId' };
      wrapper = mount(
        <GameOverContainer
          socketReducer={socketReducer}
          roomReducer={roomReducer}
          gameReducer={gameReducer}
          showGoBack={showGoBack}
          api={api}
          pleaseUnmountGame={pleaseUnmountGame}
          history={history}
        />);
      expect(wrapper.find('LeaveButton').text()).to.eql('Go back');
    });
  });
});