const canIStayHere = (where, props) => {
  return (new Promise((res, rej) => {
    if (where === 'game') {
      if (isEmpty(props.roomReducer) || isEmpty(props.socketReducer.socket))
        rej();
      else
        res();
    }
    else if (where === 'room') {
      if ((isEmpty(props.roomReducer) && isEmpty(props.homeReducer.home)) || isEmpty(props.socketReducer.socket))
        rej();
      else
        res();
    }
  }));
};

const isEmpty = (obj) => {
  if (!obj || Object.keys(obj).length === 0)
    return (true);
  else
    return (false);
};

const generateUrl = () => {
  return (Math.random().toString(36).substring(2));
};

const createNewUrl = (roomsList) => {
  let url = generateUrl();
  while (roomsList[url])
    url = generateUrl();
  return (url);
};

export { canIStayHere, isEmpty, generateUrl, createNewUrl };