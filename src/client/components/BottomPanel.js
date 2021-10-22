import React from "react";

const BottomPanel = ({ children, id }) => (
  <div className="bottomPanel" id={id}>
    {children}
  </div>
);

export default BottomPanel;