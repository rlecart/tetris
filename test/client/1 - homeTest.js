import chai, { expect } from "chai";
import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import chaiEnzyme from 'chai-enzyme';

import Home from '../../src/client/containers/HomeContainer.js';

chai.should();
chai.use(chaiEnzyme());

Enzyme.configure({ adapter: new Adapter() });

describe.only('<Home /> component test', () => {
  it('Should equal raw value', () => {
    const output = render(<Home />);
    output.should.have.html('<div>404</div>');
  });
});