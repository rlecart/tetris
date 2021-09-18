let _ = require('lodash')
let { expect } = require('chai')

let Master = require('../server/classes/Master.js')
let { expectNewRoom, expectJoinRoom, getRoomFromPlayerId } = require('./utils.js');
let { defaultRules } = require('../src/ressources/rules.js')

describe('Room Tests', () => {
	const playersId = [475, 307, 184467440737615];
	const players = [{ name: 'Hector' }, { name: '\t\n\r\v\f' }, { name: 'pouayayay' }];
	let cb = () => { console.log('Callback') };
	let master;
	let room = {};
	let mainId = 2100;
	let nbPlayer = 1;

	before(() => {
		master = new Master();
		master.startServer();
	})

	after(() => {
		master.stopServer();
	})
	
	describe('Create room', () => {
		it('Should create room', () => {
			//Nom: normal | Id: normal
			master.createRoom(playersId[0], players[0], cb);
			room = getRoomFromPlayerId(playersId[0], master);
			expectNewRoom(room, playersId[0]);
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

		it('Shouldn\'t create room (bad profile)', function () {
			//Nom: empty name
			master.createRoom(playersId[0], { name: "" }, cb);
			room = getRoomFromPlayerId(playersId[0], master);
			expectNewRoom(room, playersId[0]);
			//Nom: name null
			master.createRoom(playersId[0], { name: null }, cb);
			room = getRoomFromPlayerId(playersId[0], master);
			expectNewRoom(room, playersId[0]);
			//Bad profil object (missing 'name')
			master.createRoom(playersId[0], { pseudo: "Jean" }, cb);
			room = getRoomFromPlayerId(playersId[0], master);
			expectNewRoom(room, playersId[0]);
		});
	})

	describe('Join room', () => {
		it('Should join room ', () => {
			//Player 1 rejoint la game crée par le joueur 0
			room = getRoomFromPlayerId(playersId[0], master);
			master.joinRoom(playersId[1], players[1], room.getUrl(), cb);
			expectJoinRoom(room, playersId[1], players[1], 2);
			//Player 2 rejoint la game crée par le joueur 0
			master.joinRoom(playersId[2], players[2], room.getUrl(), cb);
			expectJoinRoom(room, playersId[2], players[2], 3);
		});

		it('Shouldn\'t join room (no more space available)', () => {
			//crée une nouvelle game pour la remplir de joueur
			master.createRoom(mainId + nbPlayer, cb);
			room = getRoomFromPlayerId(mainId + nbPlayer, master);
			while (++nbPlayer <= 8)
				master.joinRoom(mainId + nbPlayer, { name: 'joueur' + nbPlayer }, room.getUrl(), cb);
			let fullRoom = _.cloneDeep(room);
			//Essaye d'ajouter un joueur qui n'a pas de place dans la room
			master.joinRoom(667, { name: 'joueur2trop' }, room.getUrl(), cb);
			expect(getRoomFromPlayerId(667, master)).to.be.undefined;
			expect(room).to.be.eql(fullRoom);
		});
	})

	describe('Leave/delete room', () => {
		it('1 player leave room', () => {
			let roomCpy = _.cloneDeep(room);
			nbPlayer = 8;
			master.leaveRoom(mainId + nbPlayer, room.getUrl(), cb);
			expect(room).to.not.be.eql(roomCpy);
			expect(room.getNbPlayer()).eql(7);
			expect(getRoomFromPlayerId(mainId + nbPlayer, master)).to.be.undefined;
		})

		it('Delete 6 of the 7 players and give admin rights', () => {
			nbPlayer = 7;
			//retire tout les joueurs sauf  l'admin et le dernier à rejoindre la partie
			while (--nbPlayer > 0)
				master.leaveRoom(mainId + nbPlayer, room.getUrl(), cb);
			expect(room.getNbPlayer()).to.be.eql(1);
			expect(room.getOwner()).to.be.eql(mainId + 7);
		});

		it('Try to get a nonexistent player to leave the room', () => {
			//Supprime un joueur qui n'existe pas
			let roomCpy = _.cloneDeep(room);
			master.leaveRoom(8566, room.getUrl(), cb);
			expect(room).to.be.eql(roomCpy);
		});

		it('Delete last player (game too)', () => {
			master.leaveRoom(mainId + 7, room.getUrl(), cb);
			room = getRoomFromPlayerId(mainId + 7, master)
			expect(room).to.be.undefined
		});
	});
});
