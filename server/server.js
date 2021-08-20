let Master = require('./classes/Master.js')
// import Master from './classes/Master.mjs'

let master = new Master()

master.startServer()

// setTimeout(() => { master.stopServer() }, 10000)

module.exports = master