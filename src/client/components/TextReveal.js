import React, { Fragment } from "react";

const TextReveal = ({ text1, text2 }) => (
  <Fragment>
    <span className="textButton" id="gameOverTextReveal">{text1}</span>
    <span className="textButton" id="gameOverTextReveal">{text2}</span>
  </Fragment>
);

export default TextReveal;