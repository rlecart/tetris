import React from "react";

const LeaveButton = ({ toExecute, text }) => (
  <button className="roomButton" id="leaveGame" onClick={toExecute}>
    <span className="textButton">{`${text}`}</span>
  </button>
);

export default LeaveButton;