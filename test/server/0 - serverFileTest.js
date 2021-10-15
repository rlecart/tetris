import { expect } from 'chai';
import master from '../../server/server.js';

describe('Server File test', () => {
  after(() => {
    master.stopServer();
  });

  it('Should master var exists', () => {
    expect(master).to.not.be.undefined;
  });
});