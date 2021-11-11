import React from "react";

const PlayersPanel = ({
  players,
  startGameButton,
  leaveRoom
}) => (
  <div className="blocMenu" id="listPlayers">
    <div className="playerList">
      {players}
    </div>
    <div className="bottomButtons">
      <button className="roomButton" id="leave" onClick={leaveRoom}>
        <span className="textButton">Quitter</span>
      </button>
      {startGameButton}
    </div>
  </div>
);

export default PlayersPanel;