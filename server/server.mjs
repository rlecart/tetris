// const { Master } = require('./classes/Master')
import Master from './classes/Master.mjs'

export const master = new Master()

master.startServer()

// setTimeout(() => { master.stopServer() }, 10000)

export default master