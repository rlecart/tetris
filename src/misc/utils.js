const canIStayHere = (where, context) => {
  return (new Promise((res, rej) => {
    if (where === 'game') {
      if (Object.keys(context.props.roomReducer).length === 0 || Object.keys(context.props.socketConnector.socket).length === 0)
        rej();
      else
        res();
      // if (context.)
    }
    else if (where === 'room') {
      if ((Object.keys(context.props.roomReducer).length === 0 && Object.keys(context.props.homeReducer.home).length === 0) || Object.keys(context.props.socketConnector.socket).length === 0)
        rej();
      else
        res();
    }
  }));
};

const isEmpty = (obj) => {
  if (Object.keys(obj).length === 0)
    return (true);
  else
    return (false);
};

const generateUrl = () => {
  return (Math.random().toString(36).substring(7));
};

const createNewUrl = (roomsList) => {
  let url = generateUrl();
  while (roomsList[url])
    url = generateUrl();
  return (url);
};

const getArrayFromObject = (obj) => {
  let ret = [];

  for (let value of Object.values(obj))
    ret.push(value);
  return (ret);
};


module.exports = { canIStayHere, isEmpty, generateUrl, createNewUrl, getArrayFromObject };