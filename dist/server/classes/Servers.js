'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _params = require('../../../params.js');

var _params2 = _interopRequireDefault(_params);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mainServer = function () {
  function mainServer() {
    _classCallCheck(this, mainServer);

    this._host = _params2.default.server.host;
    this._port = _params2.default.server.port;
    this._app = {};
    this._server = {};
    this._io = {};
  }

  _createClass(mainServer, [{
    key: 'getHttpServer',
    value: function getHttpServer() {
      return this._server;
    }
  }, {
    key: 'getIoServer',
    value: function getIoServer() {
      return this._io;
    }
  }, {
    key: 'initApp',
    value: function initApp(cb) {
      var _params$server = _params2.default.server,
          host = _params$server.host,
          port = _params$server.port;

      var handler = function handler(req, res) {
        var file = req.url === '/bundle.js' ? '/../../../build/bundle.js' : '/../../../index.html';
        _fs2.default.readFile(__dirname + file, function (err, data) {
          if (err) {
            console.log(err);
            // logerror(err);
            res.writeHead(500);
            return res.end('Error loading index.html');
          }
          res.writeHead(200);
          res.end(data);
        });
      };

      this._app.on('request', handler);

      this._server = this._app.listen({ host: host, port: port }, function () {
        // loginfo(`tetris listen on ${params.url}`);
        cb();
      });
    }
  }, {
    key: 'startServer',
    value: function startServer(cb) {
      var _this = this;

      this._app = _http2.default.createServer();
      this.initApp(function () {
        _this._io = (0, _socket2.default)(_this._app, {
          cors: {
            origin: _params2.default.server.url2,
            methods: ["GET", "POST"],
            credentials: true
          },
          'pingInterval': 5000
        });
        cb();
      });
      // console.log('[HTTP server started]')
    }
  }, {
    key: 'stopServer',
    value: function stopServer() {
      this._server.close();
    }
  }, {
    key: 'stopListenSio',
    value: function stopListenSio(sioList) {
      if (Object.values(sioList).length !== 0) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.values(sioList)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var client = _step.value;

            client.disconnect();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      this._io.close();
    }
  }, {
    key: 'listenSio',
    value: function listenSio(master) {
      this._io.on('connection', function (client) {
        master.addNewSio(client);
        client.on('move', function (clientId, url, dir, res) {
          if (master.getRoom(url) && master.getRoom(url).isInGame() === true) master.askToMove(clientId, url, dir, res);
        });
        client.on('createRoom', function (clientId, profil, cb) {
          master.createRoom(clientId, profil, cb);
        });
        client.on('joinRoom', function (clientId, profil, url, cb) {
          master.joinRoom(clientId, profil, url, cb);
        });
        client.on('leaveRoom', function (clientId, url, res) {
          master.leaveRoom(clientId, url, res);
        });
        client.on('getRoomInfo', function (url, cb) {
          var room = void 0;

          if (room = master.getRoom(url)) cb({ type: 'ok', value: room.getRoomInfo() });else cb({ type: 'err', value: 'cant find room' });
        });
        client.on('askToStartGame', function (clientId, url, res) {
          master.askToStartGame(clientId, url, res);
        });
        client.on('readyToStart', function (clientId, url, res) {
          master.readyToStart(clientId, url, res);
        });
        client.on('askToEndGame', function (clientId, url, res) {
          master.askToEndGame(clientId, url, res);
        });
        client.on('askEverybodyToCalmDown', function (clientId, url, res) {
          master.askEverybodyToCalmDown(clientId, url, res);
        });
        client.on('ping', function () {
          client.emit('pong');
        });
        client.conn.on('heartbeat', function () {
          console.log('heartbeat called!');
          master.setSioHbeat(client.id, Date.now());
          setTimeout(function () {
            var now = Date.now();

            if (now - master.getSioHbeat(client.id) > 5000) {
              console.log('this client id will be closed ' + client.id);
              var room = master.getRoomFromPlayerId(client.id, master);
              if (room !== undefined) master.leaveRoom(client.id, room.getUrl(), function () {});
              setTimeout(function () {
                return master.removeSio(client);
              }, 500);
            }
            now = null;
          }, 6000);
        });
        // console.log('connected')
      });
      this._io.listen(this._port);
      // console.log(`[Io listening on port ${this._port}]`);
    }
  }]);

  return mainServer;
}();

exports.default = mainServer;
;