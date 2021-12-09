import React, { Fragment } from "react";

const Spec = ({ name, lines, key }) => (
  <Fragment>
    <div className='blocSpec'>
      <div className="board" id='spec'>
        {lines}
      </div>
      <div className="nicknameSpec">{name}</div>
    </div>
  </Fragment >
);

export default Spec;