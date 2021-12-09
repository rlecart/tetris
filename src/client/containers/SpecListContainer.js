import React, { Fragment } from "react";
import Spec from "../components/Spec";
import SpecList from "../components/SpecList";
import LinesContainer from "./LinesContainer";

const createSpec = (players) => {
  let ret = [];

  ret = players.map((player, key) => {
    return (
      <div key={key}>
        <Spec
          name={player.name}
          lines={
            <LinesContainer
              lines={player.lines}
              lineClass={'line'}
              blocClass={'lineBloc'}
              id={'spec'}
            />
          }
        />
      </div>
    )
  })
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