import { expect } from 'chai';
import master from '../../server/server.js';

describe('Server File test', () => {
  before(() => {
    // master = require('../../server/server');
  });

  after(() => {
    master.stopServer();
  });

  it('Should master var exists', () => {
    expect(master).to.not.be.undefined;
  });
});