import React from "react";

const ProfilPanel = ({ homeReducer, handleChange }) => (
  <div className="blocMenu" id="home">
    <div className="avatarSelector">
      <div className="avatarButton" />
      <div className="avatar" />
      <div className="avatarButton" />
    </div>
    <input
      className='username'
      type="text"
      name="name"
      pattern='[A-Za-z-]{1,}' required
      placeholder='username'
      value={homeReducer.profil.name}
      onChange={(event) => handleChange(event)} />
  </div>
);

export default ProfilPanel;