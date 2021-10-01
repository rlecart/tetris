let Master = require('./classes/Master.js');
let master = new Master();

master.startServer();

module.exports = master;