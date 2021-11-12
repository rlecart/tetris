import React from "react";
import Board from "./Board";
import RightPanel from "./RightPanel";

const GamePanel = ({ displayLines, nextTetri }) => (
  <div className="game">
    <Board displayLines={displayLines} />
    <RightPanel nextTetri={nextTetri} />
  </div>
);

export default GamePanel;