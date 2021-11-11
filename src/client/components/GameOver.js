import React from "react";

const GameOver = ({ finalText, returnToRoomButton, goBack }) => (
  <div className="gameOverDisplay">
    <div className="gameOverLayout">
      <div className="gameOverTitle">
        <span className="textButton" id="gameOverText">OMG GG WP DUUUDE</span>
        {finalText}
      </div>
      <div className="bottomButtons">
        {returnToRoomButton}
        {goBack}
      </div>
    </div>
  </div>
);

export default GameOver;