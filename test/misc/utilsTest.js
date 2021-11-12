import { expect } from 'chai';
import { isEmpty, canIStayHere, createNewUrl } from '../../src/misc/utils.js';
import { initialSocketState } from '../../src/client/reducers/socketReducer.js';
import { initialHomeState } from '../../src/client/reducers/homeReducer.js';
import { initialRoomState } from '../../src/client/reducers/roomReducer.js';
import openSocket from 'socket.io-client';
import _ from 'lodash';
import params from '../../params.js'

describe('Utils tests', () => {
  describe('isEmpty tests', () => {
    it('Should return true', () => {
      expect(isEmpty({})).to.be.true;
      expect(isEmpty(undefined)).to.be.true;
    });

    it('Should return false', () => {
      expect(isEmpty({ abc: 'test' })).to.be.false;
    });
  });

  describe('canIStayHere tests', () => {
    let socketReducer = initialSocketState;
    let homeReducer = initialHomeState;
    let roomReducer = initialRoomState;

    before(() => { socketReducer.socket = openSocket(params.server.url); });
    after(() => { socketReducer.socket.disconnect(); });

    describe('game', () => {
      it('Should resolve', async () => {
        let ret;

        await canIStayHere('game', { roomReducer, socketReducer })
          .then(() => { ret = 'resolved'; }, () => { ret = 'rejected'; });
        expect(ret).to.be.eql('resolved');
      });

      it('Should reject', async () => {
        let ret;

        await canIStayHere('game', {})
          .then(() => { ret = 'resolved'; }, () => { ret = 'rejected'; });
        expect(ret).to.be.eql('rejected');
      });
    });
    describe('room', () => {
      it('Should resolve', async () => {
        let ret;

        await canIStayHere('room', { roomReducer, homeReducer, socketReducer })
          .then(() => { ret = 'resolved'; }, () => { ret = 'rejected'; });
        expect(ret).to.be.eql('resolved');
      });

      it('Should reject', async () => {
        let ret;

        await canIStayHere('room', {})
          .then(() => { ret = 'resolved'; }, () => { ret = 'rejected'; });
        expect(ret).to.be.eql('rejected');
      });
    });
  });

  describe('Url tests', () => {
    let roomsList = [];

    it('Should create url', () => {
      let ret = createNewUrl(roomsList);

      roomsList.push(ret);
      expect(ret).to.exist;
      expect(ret).to.be.a.string;
    });

    it('Should create a new and different url', () => {
      let ret = createNewUrl(roomsList);

      roomsList.push(ret);
      expect(ret).to.not.be.eql(roomsList[0]);
    });

    it('Should create 100000 new url but different', () => {
      let ret;

      for (let i = 0; i < 100000; i++) {
        ret = createNewUrl(roomsList);
        roomsList.push(ret);
      }
      expect(new Set(roomsList).size).to.be.eql(roomsList.length);
    });

  });
});