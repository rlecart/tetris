import Master from './classes/Master.js';
let master = new Master();

master.startServer().then(() => console.log('aye suis ready')).catch(() => console.log('qqqqq'));

export default master;