import chai, { expect } from "chai";
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import chaiEnzyme from 'chai-enzyme';
import _ from 'lodash';

import LinesContainer from '../../src/client/containers/LinesContainer.js';

import defaultGame from '../../src/ressources/defaultGame';

chai.use(chaiEnzyme());
Enzyme.configure({ adapter: new Adapter() });

describe('<LinesContainer /> test', () => {
  let wrapper;

  it('Should not render (props undefined)', () => {
    wrapper = mount(
      <LinesContainer
        lines={undefined}
        lineClass={undefined}
        blocClass={undefined}
        id={undefined}
        idTetri={undefined}
      />);
    expect(wrapper.find('Line').exists()).to.be.false;
  });

  it('Should render (valid props)', () => {
    wrapper = mount(
      <LinesContainer
        lines={defaultGame.lines}
        lineClass={'line'}
        blocClass={'lineBloc'}
        id={'spec'}
        idTetri={undefined}
      />);
    expect(wrapper.find('Line').exists()).to.be.true;
  });

  it('Should render (valid props but with square tetri)', () => {
    wrapper = mount(
      <LinesContainer
        lines={defaultGame.lines}
        lineClass={'line'}
        blocClass={'lineBloc'}
        id={'spec'}
        idTetri={5}
      />);
    expect(wrapper.find('Line').exists()).to.be.true;
  });

  it('Should render (valid props but with square tetri already unshifted)', () => {
    wrapper = mount(
      <LinesContainer
        lines={[
          [0, 1, 1, 0],
          [0, 1, 1, 0],
        ]}
        lineClass={'line'}
        blocClass={'lineBloc'}
        id={'spec'}
        idTetri={5}
      />);
    expect(wrapper.find('Line').exists()).to.be.true;
  });
});