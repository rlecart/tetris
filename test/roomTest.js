let Master = require('../server/classes/Master.js')
let { expect } = require('chai')
let _ = require('lodash')

let { expectNewRoom, expectJoinRoom, getRoomFromPlayerId } = require('./utils.js');
let { defaultRules } = require('../src/ressources/rules.js')

describe('Room Tests', () => {
	let master
	let cb = () => { console.log('Callback') };
	const playersId = [475, 307, 184467440737615];
	const players = [{ name: 'Hector' }, { name: '\t\n\r\v\f' }, { name: 'pouayayay' }];
	let room = {};
	//let sock = openSocket('http://localhost:8000')

	before(() => {
		master = new Master()
		master.startServer()
	})

	after(() => {
		master.stopServer()
	})

	describe('[ROOM CREATE]', () => {
		it('Should create room', () => {
			//Nom: normal | Id: normal
			master.createRoom(playersId[0], players[0], cb);
			room = getRoomFromPlayerId(playersId[0], master);
			expectNewRoom(room, playersId[0])
			//Nom: tnrvf | Id: normal
			master.createRoom(playersId[1], players[1], cb);
			room = getRoomFromPlayerId(playersId[1], master);
			expectNewRoom(room, playersId[1]);
			//Nom: normal | Id: long
			master.createRoom(playersId[2], players[2], cb);
			room = getRoomFromPlayerId(playersId[2], master);
			expectNewRoom(room, playersId[2]);
		});

		it('Shouldn\'t create room (bad clientId)', function () {
			let badRoom
			let badPlayerId = undefined

			master.createRoom(badPlayerId, { name: 'badId' }, cb);
			badRoom = getRoomFromPlayerId(badPlayerId, master)
			expect(badRoom).to.be.undefined
		})

		it('Shouldn\'t create room (bad profil)', function () {
			//Nom: empty name
			master.createRoom(playersId[0], { name: "" }, cb);
			expectNewRoom(getRoomFromPlayerId(playersId[0], master), playersId[0]);
			//Nom: name null
			master.createRoom(playersId[0], { name: null }, cb);
			expectNewRoom(getRoomFromPlayerId(playersId[0], master), playersId[0]);
			//Bad profil object (missing 'name')
			master.createRoom(playersId[0], { pseudo: "Jean" }, cb);
			expectNewRoom(getRoomFromPlayerId(playersId[0], master), playersId[0]);

		})

	})

	let mainId = 2100
	let nbPlayer = 1

	describe('[ROOM JOINED]', () => {

		it('Should join room ', () => {
			//Player 1 rejoint la game crée par le joueur 0
			room = getRoomFromPlayerId(playersId[0], master);
			master.joinRoom(playersId[1], players[1], room.getUrl(), cb);
			expectJoinRoom(room, playersId[1], players[1], 2);
			//Player 2 rejoint la game crée par le joueur 0
			master.joinRoom(playersId[2], players[2], room.getUrl(), cb);
			expectJoinRoom(room, playersId[2], players[2], 3);

		});

		it('Shouldn\'t join room (no more space left)', () => {
			//crée une nouvelle game pour la remplir de joueur
			master.createRoom(mainId + nbPlayer, { name: 'joueur' + nbPlayer }, cb);
			room = getRoomFromPlayerId(mainId + nbPlayer, master);
			while (++nbPlayer <= 8) {
				master.joinRoom(mainId + nbPlayer, { name: 'joueur' + nbPlayer }, room.getUrl(), cb);
			}
			let fullRoom = _.cloneDeep(room);
			//Essaye d'ajouter un joueur qui n'a pas de place dans la room
			master.joinRoom(667, "joueur2trop", room.getUrl(), cb);
			expect(getRoomFromPlayerId(667, master)).to.be.undefined;
			expect(room).to.be.eql(fullRoom);
		});

	})

	describe('[ROOM DELETE]', () => {

		it('Delete 7 of the 8 players and give admin rights', () => {
			nbPlayer = 8
			//retire tout les joueurs sauf  l'admin et le dernier à rejoindre la partie
			while (--nbPlayer > 0) {
				master.leaveRoom(mainId + nbPlayer, { name: 'player' + nbPlayer }, room.getUrl(), cb);
			}
			expect(room.getNbPlayer()).to.be.eql(1);
			expect(room.getOwner()).to.be.eql(mainId + 8);

			//Supprime un joueur qui n'existe pas
			let fullRoom = _.cloneDeep(room);
			master.leaveRoom(8566, { name: 'Home invisible' }, room.getUrl(), cb);
			expect(room).to.be.eql(fullRoom);
		});

		it('Delete last player (game too)', () => {
			//console.log(room.getUrl())
			master.leaveRoom(mainId + 8, { name: 'player' + 8 }, room.getUrl(), cb);
			room = getRoomFromPlayerId(mainId + 8, master)
			expect(room).to.be.undefined
		})

	});

});
