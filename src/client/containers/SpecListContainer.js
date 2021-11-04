import React, { Fragment } from "react";
import Spec from "../components/Spec";
import SpecList from "../components/SpecList";
import LinesContainer from "./LinesContainer";

const createSpec = (players) => {
  let ret = [];

  for (let player of players) {
    ret.push(
      <Spec
        key={player.name}
        name={player.name}
        lines={
          <LinesContainer
            key={player.name}
            lines={player.lines}
            lineClass={'line'}
            blocClass={'lineBloc'}
            id={'spec'}
          />
        }
      />
    );
  }
  return (ret);
};

const SpecListContainer = ({ specList }) => {
  let specs = specList ? createSpec(specList) : undefined;

  return (
    <Fragment>
      {specs ? <SpecList specs={specs} /> : undefined}
    </Fragment>
  );
};

export default SpecListContainer;