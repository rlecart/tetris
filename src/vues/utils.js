const api = require('../api/clientApi.js')

const canIStayHere = (where, context) => {
  return (new Promise((res, rej) => {
    let url = context.props.location.pathname
    let name = url.substring(url.search(/\[[0-9a-zA-Z]+\]/) + 1, url.length - 1)
    let idRoom = url.substring(1, url.search(/\[/))

    console.log(context)
    console.log('weoighwe')
    if (where === 'game') {
      if (Object.keys(context.props.roomReducer).length === 0 || Object.keys(context.props.socketConnector.socket).length === 0)
        rej()
      else
        res()
      // if (context.)
    }
    else if (where === 'room') {
      if ((Object.keys(context.props.roomReducer).length === 0 && Object.keys(context.props.homeReducer.home).length === 0) || Object.keys(context.props.socketConnector.socket).length === 0)
        rej()
      else
        res()
    }
  }))
}

const isEmpty = (obj) => {
  if (Object.keys(obj).length === 0)
    return (true)
  else
    return (false)
}

module.exports = { canIStayHere, isEmpty }