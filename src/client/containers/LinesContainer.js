import React from "react";
import colors from '../../ressources/defaultColors.js';

const Bloc = ({ bloc, blocClass, id, idTetri }) => {
  let col = (idTetri && bloc !== 0) ? idTetri : bloc;

  return (<div className={blocClass} id={id} style={{ backgroundColor: colors[col] }} />);
};

const Line = ({ line, blocClass, id, idTetri }) => {
  let ret = [];

  for (let i in line)
    ret.push(<Bloc key={i} bloc={line[i]} blocClass={blocClass} id={id} idTetri={idTetri} />);
  return (ret);
};

const LinesContainer = ({ lines, lineClass, blocClass, id, idTetri }) => {
  let ret = [];

  if (idTetri === 5 && lines.length < 3)
    lines.unshift(new Array(lines[0].length).fill(0));
  for (let i in lines) {
    ret.push(
      <div key={i} className={lineClass}>
        {<Line line={lines[i]} blocClass={blocClass} id={id} idTetri={idTetri} />}
      </div>
    );
  }
  return (ret);
};

export default LinesContainer;