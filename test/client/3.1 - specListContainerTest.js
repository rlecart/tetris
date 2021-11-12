import chai, { expect } from "chai";
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import chaiEnzyme from 'chai-enzyme';
import _ from 'lodash';

import SpecListContainer from '../../src/client/containers/SpecListContainer.js';

import defaultGame from '../../src/ressources/defaultGame';

chai.use(chaiEnzyme());
Enzyme.configure({ adapter: new Adapter() });

describe('<SpecListContainer /> test', () => {
  let wrapper;

  it('Should not render specs with 1 player only', () => {
    wrapper = mount(<SpecListContainer specList={undefined} />);
    expect(wrapper.find('Spec').exists()).to.be.false;
  });

  it('Should render specs with 2 players', () => {
    wrapper = mount(<SpecListContainer specList={[{
      name: 'test1',
      lines: defaultGame.lines
    }]} />);
    expect(wrapper.find('Spec').exists()).to.be.true;
  });
});