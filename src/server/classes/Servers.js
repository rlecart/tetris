import fs from 'fs';
import http from 'http';
import Server from 'socket.io';
import params from '../../../params.js';

export default class mainServer {
  constructor() {
    this._host = params.server.host;
    this._port = params.server.port;
    this._app = {};
    this._httpServer = {};
    this._ioServer = {};
  }

  get httpServer() {
    return (this._httpServer);
  }

  set httpServer(value) {
    this._httpServer = value;
  }

  get ioServer() {
    return (this._ioServer);
  }

  set ioServer(value) {
    this._ioServer = value;
  }

  get app() {
    return (this._app);
  }

  set app(value) {
    this._app = value;
  }

  initApp(cb) {
    const { host, port } = params.server;
    const handler = (req, res) => {
      const file = req.url === '/bundle.js' ? '/../../../build/bundle.js' : '/../../../index.html';
      fs.readFile(__dirname + file, (err, data) => {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
      });
    };

    this.app.on('request', handler);

    this.httpServer = this.app.listen({ host, port }, () => { cb(); });
  }

  startServer(cb) {
    this.app = http.createServer();
    this.initApp(() => {
      this.ioServer = Server(this.app, {
        cors: {
          origin: params.server.url2,
          methods: ["GET", "POST"],
          credentials: true
        },
        'pingInterval': 5000
      });
      cb();
    });
    // console.log('[HTTP server started]')
  }

  stopServer() {
    this.httpServer.close();
  }

  stopListenSio(sioList) {
    if (Object.values(sioList).length !== 0) {
      for (let client of Object.values(sioList)) {
        client.disconnect();
      }
    }
    this.ioServer.close();
  }

  listenSio(master) {
    this.ioServer.on('connection', (client) => {
      master.addNewSio(client);
      client.on('move', (clientId, url, dir, cb) => { master.askToMove(clientId, url, dir, cb); });
      client.on('createRoom', (clientId, profil, cb) => { master.createRoom(clientId, profil, cb); });
      client.on('joinRoom', (clientId, profil, url, cb) => { master.joinRoom(clientId, profil, url, cb); });
      client.on('leaveRoom', (clientId, url, cb) => { master.leaveRoom(clientId, url, cb); });
      client.on('getRoomInfo', (url, cb) => { master.askToGetRoomInfo(url, cb); });
      client.on('askToStartGame', (clientId, url, cb) => { master.askToStartGame(clientId, url, cb); });
      client.on('readyToStart', (clientId, url, cb) => { master.readyToStart(clientId, url, cb); });
      client.on('askToEndGame', (clientId, url, cb) => { master.askToEndGame(clientId, url, cb); });
      client.on('askEverybodyToCalmDown', (clientId, url, cb) => { master.askEverybodyToCalmDown(clientId, url, cb); });
      client.on('ping', () => { client.emit('pong'); });
      client.conn.on('heartbeat', () => { master.heartbeat(client); });
      // console.log('connected')
    });
    this.ioServer.listen(this._port);
    // console.log(`[Io listening on port ${this._port}]`);
  }
};
