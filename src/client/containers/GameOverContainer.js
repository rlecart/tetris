import React from "react";
import { isEmpty } from "../../misc/utils";

import TextReveal from "../components/TextReveal";
import LeaveButton from "../components/LeaveButton";
import GameOver from "../components/GameOver";

const GameOverContainer = ({
  socketReducer,
  roomReducer,
  gameReducer,
  showGoBack,
  api,
  pleaseUnmountGame,
  history
}) => {
  if (gameReducer.winner !== undefined) {
    let returnToRoomButton = undefined;
    let goBack = undefined;
    let finalText = undefined;
    let text1 = undefined;
    let text2 = undefined;

    if (roomReducer.owner === socketReducer.socket.id)
      returnToRoomButton = (
        <LeaveButton
          text='flex'
          toExecute={() => api.askEverybodyToCalmDown(socketReducer.socket, roomReducer.url)}
        />
      );
    if (showGoBack === true && !(roomReducer.owner === socketReducer.socket.id))
      goBack = (
        <LeaveButton
          text='Go back'
          toExecute={() => {
            let profil = roomReducer.listPlayers[socketReducer.socket.id]._profil;
            pleaseUnmountGame();
            history.replace(`/${roomReducer.url}[${profil.name}]`);
          }}
        />
      );
    if (!isEmpty(gameReducer.winner)) {
      text1 = (gameReducer.winner.id === socketReducer.socket.id) ?
        'what a pro you are, such a nice musculature!!! :Q' :
        'but you lose, like the looser you are! :(((';
      text2 = (gameReducer.winner.id === socketReducer.socket.id) ?
        'YOU are the real beaugosse!' :
        `${gameReducer.winner.name} is the real beaugosse!`;
      finalText = <TextReveal text1={text1} text2={text2} />;
    }

    return (
      <GameOver
        finalText={finalText}
        returnToRoomButton={returnToRoomButton}
        goBack={goBack}
      />
    );
  }
};

export default GameOverContainer;