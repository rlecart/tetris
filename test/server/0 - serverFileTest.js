const { expect } = require('chai');

describe('Server File test', () => {
  let master;

  before(() => {
    master = require('../../server/server');
  });

  after(() => {
    master.stopServer();
  });

  it('Should master var exists', () => {
    expect(master).to.not.be.undefined;
  });
});