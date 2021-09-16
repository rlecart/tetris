let Master = require('./classes/Master.js')

let master = new Master()

if (master.getServer() === undefined)
  master.startServer()

// setTimeout(() => { master.stopServer() }, 10000)

module.exports = master