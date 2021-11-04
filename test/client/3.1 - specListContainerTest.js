import chai, { expect, assert } from "chai";
import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import chaiEnzyme from 'chai-enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import _ from 'lodash';

import { createANewStore } from "../helpers/helpers.js";
import SpecListContainer from '../../src/client/containers/SpecListContainer.js';

import defaultGame from '../../src/ressources/defaultGame';

chai.should();
chai.use(chaiEnzyme());
Enzyme.configure({ adapter: new Adapter() });

describe('<SpecListContainer /> test', () => {
  let wrapper;
  let specList = undefined;

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