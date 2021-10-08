let { config } = require('../../serverConfig.js');
let http = require('http');
let { Server } = require('socket.io');

module.exports = class mainServer {
  constructor() {
    this._port = config.back.port;
    this._server = {};
    this._io = {};
  }
  
  getHttpServer() {
    return (this._server);
  }

  getIoServer() {
    return (this._io);
  }

  startServer() {
    this._server = http.createServer();
    this._io = new Server(this._server, {
      cors: {
        origin: config.front.url + ':' + config.front.port,
        methods: ["GET", "POST"],
        credentials: true
      },
      'pingInterval': 5000
    });
    // console.log('[HTTP server started]')
  }

  stopServer() {
    this._server.close();
  }

  stopListenSio(sioList) {
    if (Object.values(sioList).length !== 0) {
      for (let client of Object.values(sioList)) {
        client.disconnect();
      }
    }
    this._io.close();
  }

  listenSio(master) {
    this._io.on('connection', (client) => {
      master.addNewSio(client);
      client.on('move', (clientId, url, dir, res) => {
        if (master.getRoom(url) && master.getRoom(url).isInGame() === true)
          master.askToMove(clientId, url, dir, res);
      });
      client.on('createRoom', (clientId, profil, res) => { master.createRoom(clientId, profil, res); });
      client.on('joinRoom', (clientId, profil, url, res) => { master.joinRoom(clientId, profil, url, res); });
      client.on('leaveRoom', (clientId, url, res) => { master.leaveRoom(clientId, url, res); });
      client.on('getRoomInfo', (url, res) => {
        let room;

        if ((room = master.getRoom(url)))
          res(room.getRoomInfo());
      });
      client.on('askToStartGame', (clientId, url, res) => { master.askToStartGame(clientId, url, res); });
      client.on('readyToStart', (clientId, url, res) => { master.readyToStart(clientId, url, res); });
      client.on('askToEndGame', (clientId, url, res) => { master.askToEndGame(clientId, url, res); });
      client.on('askEverybodyToCalmDown', (clientId, url, res) => { master.askEverybodyToCalmDown(clientId, url, res); });
      client.on('ping', () => { client.emit('pong'); });
      client.conn.on('heartbeat', () => {
        console.log('heartbeat called!');
        master.setSioHbeat(client.id, Date.now());
        setTimeout(() => {
          let now = Date.now();

          if (now - master.getSioHbeat(client.id) > 5000) {
            console.log('this client id will be closed ' + client.id);
            let room = master.getRoomFromPlayerId(client.id, master);
            if (room !== undefined)
              master.leaveRoom(client.id, room.getUrl(), () => { });
            setTimeout(() => master.removeSio(client), 500);
          }
          now = null;
        }, 6000);
      });
      console.log('connected')
    });
    this._io.listen(this._port);
    // console.log(`[Io listening on port ${this._port}]`);
  }
};
