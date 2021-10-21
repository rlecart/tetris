import chai, { expect } from "chai";
import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import chaiEnzyme from 'chai-enzyme';

import NotFound from '../../src/client/components/NotFound.js';

chai.should()
chai.use(chaiEnzyme())

Enzyme.configure({ adapter: new Adapter() })

describe('<Home /> component test', () => {
  it('Should equal raw value', () => {
    const output = render(<NotFound />);
    output.should.have.html('<div>404</div>');
  });
});