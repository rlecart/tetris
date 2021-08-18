const generateUrl = () => {
  return (Math.random().toString(36).substring(7))
}

const createNewUrl = (roomsList) => {
  let url = generateUrl()
  while (roomsList[url])
    url = generateUrl()
  return (url)
}

const getArrayFromObject = (obj) => {
  let ret = []

  for (let [key, value] of Object.entries(obj))
    ret.push(value)
  return ret
}

export { generateUrl, createNewUrl, getArrayFromObject }