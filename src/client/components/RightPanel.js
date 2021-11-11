import React from "react";

const RightPanel = ({ nextTetri }) => (
  <div className="rightPanel">
    <div className="nextText">NEXT :</div>
    <div className="nextPiece">
      {nextTetri}
    </div>
    <div className="score">Score :<br />00</div>
  </div>
);

export default RightPanel;