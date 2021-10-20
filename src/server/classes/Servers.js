import fs from 'fs';
import debug from 'debug';
import http from 'http';
import Server from 'socket.io';
import params from '../../../params.js';

export default class mainServer {
  constructor() {
    this._host = params.server.host;
    this._port = params.server.port;
    this._app = {};
    this._server = {};
    this._io = {};
  }

  getHttpServer() {
    return (this._server);
  }

  getIoServer() {
    return (this._io);
  }

  initApp(cb) {
    const { host, port } = params.server;
    const handler = (req, res) => {
      const file = req.url === '/bundle.js' ? '/../../../build/bundle.js' : '/../../../index.html';
      fs.readFile(__dirname + file, (err, data) => {
        if (err) {
          console.log(err)
          // logerror(err);
          res.writeHead(500);
          return res.end('Error loading index.html');
        }
        console.log(data)
        res.writeHead(200);
        res.end(data);
      });
    };

    this._app.on('request', handler);

    this._server = this._app.listen({ host, port }, () => {
      // loginfo(`tetris listen on ${params.url}`);
      cb();
    });
  }

  startServer(cb) {
    this._app = http.createServer();
    this.initApp(() => {
      this._io = Server(this._app, {
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
      client.on('joinRoom', (clientId, profil, url, cb) => { master.joinRoom(clientId, profil, url, cb); });
      client.on('leaveRoom', (clientId, url, res) => { master.leaveRoom(clientId, url, res); });
      client.on('getRoomInfo', (url, res) => {
        let room;

        if ((room = master.getRoom(url)))
          res({ type: 'ok', value: room.getRoomInfo() });
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
    console.log(`[Io listening on port ${this._port}]`);
  }
};
