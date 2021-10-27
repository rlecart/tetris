import React from "react";

const RoomSelectorPanel = ({ homeReducer, whichButton, setWhichButton, handleChange }) => (
  <div className="blocMenu" id="home">
    <input className='roomUrl' type="text" name="roomUrl" required={whichButton === 'joinRoom'} value={homeReducer.joinUrl}
      onChange={(event) => handleChange(event)} placeholder='URL' />
    <button type="submit" className="roomButton" id="joinRoomButton" onClick={() => setWhichButton('joinRoom')}>
      <span className="textButton">Join room</span>
    </button>
    <button type="submit" className="roomButton" id="createRoomButton" onClick={() => setWhichButton('createRoom')}>
      <span className="textButton">Create Room</span>
    </button>
  </div>
);

export default RoomSelectorPanel;