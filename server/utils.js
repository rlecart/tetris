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

module.exports = { generateUrl, createNewUrl, getArrayFromObject };
