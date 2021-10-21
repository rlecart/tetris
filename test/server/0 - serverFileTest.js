import { expect } from 'chai';

describe('Server File test', () => {
  let master;

  before(() => {
    master = require('../../src/server/main.js').default;
  });
  after(() => {
    master.stopServer();
  });

  it('Should master var exists', () => {
    expect(master).to.not.be.undefined;
  });
});