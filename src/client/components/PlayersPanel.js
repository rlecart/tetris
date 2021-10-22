import React from "react";

const PlayersPanel = ({
  socketReducer,
  roomReducer,
  api,
  history,
  players,
  startGameButton,
  pleaseUnmountRoom
}) => (
  <div className="blocMenu" id="listPlayers">
    <div className="playerList">
      {players}
    </div>
    <div className="bottomButtons">
      <button className="roomButton" id="leaveLaunch" onClick={() => {
        api.leaveRoom(socketReducer.socket, roomReducer.url)
          .then(() => {
            pleaseUnmountRoom('completly');
            history.replace('/');
          });
      }}>
        <span className="textButton">Quitter</span>
      </button>
      {startGameButton}
    </div>
  </div>
);

export default PlayersPanel;