let Master = require('./classes/Master.js')

let master = new Master()

master.startServer()
//console.log('ouihahahahaha')

// setTimeout(() => { master.stopServer() }, 10000)

module.exports = master
