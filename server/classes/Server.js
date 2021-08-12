const { config } = require('../../config')
const http = require('http')
const socketio = require('socket.io')

exports.Server = class Server {
    constructor(parent) {
        this._parent = parent

        this._port = config.back.port
        this._server = {}
        this._io = {}
    }

    getParent() {
        return (this._parent)
    }

    startServer() {
        this._server = http.createServer();
        this._io = socketio(this._server, {
            cors: {
            origin: config.front.url + ':' + config.front.port,
            methods: ["GET", "POST"],
            credentials: true
            },
            'pingInterval': 5000
        });
    }

    listenSio() {
        const master = this.getParent()

        this._io.on('connection', (client) => {
            master.addNewSio(client)
            client.on('move', (clientId, url, dir) => {
              if (master.getRoom(url).isInGame())
                master.askToMove(clientId, url, dir)
            })
            client.on('createRoom', (clientId, profil, cb) => { master.createRoom(clientId, profil, cb) })
            client.on('joinRoom', (clientId, profil, url, cb) => { master.joinRoom(clientId, profil, url, cb) })
            client.on('getRoomInfo', (url, cb) => { master.getRoom(url).getRoomInfo(cb) })
            client.on('askToStartGame', (clientId, profil, url, cb) => { master.askToStartGame(clientId, profil, url, cb) })
            client.on('readyToStart', (clientId, url) => { master.readyToStart(clientId, url) })
            client.conn.on('heartbeat', () => {
              console.log('heartbeat called!');
              master.setSioHbeat(client.id, Date.now())
              setTimeout(function () {
                var now = Date.now();
                if (now - master.getSioHbeat(client.id) > 5000) {
                  console.log('this client id will be closed ' + client.id);
                  if (1) {
                    // removeFromLobby(client.id);
          
                    try {
                      // this is the most important part
                      console.log(this._io.clients, '\n')
                      this._io.clients.connected[client.id].disconnect();
                    } catch (error) {
                      console.log(error)
                    }
                  }
                }
                now = null;
              }, 6000);
            });
          
            console.log('connected')
          })
          this._io.listen(this._port);
          console.log('listening on port ', this._port);
    }
}