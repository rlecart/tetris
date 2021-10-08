let _ = require('lodash');
let { expect } = require('chai');

let Master = require('../../server/classes/Master.js');
let { expectNewRoom, expectJoinRoom } = require('../helpers/helper.js');

describe('Room Tests', () => {
	const playersId = [475, 307, 184467440737615];
	const players = [{ name: 'Hector' }, { name: '\t\n\r\v\f' }, { name: 'pouayayay' }];
	let cb = () => { };
	let master;
	let room = {};
	let mainId = 2100;
	let nbPlayer = 1;

	before(() => {
		master = new Master();
		master.startServer();
	});

	after(() => {
		master.stopServer();
	});

	describe('Create room', () => {
		it('Should create room', () => {
			master.createRoom(playersId[0], players[0], cb);
			room = master.getRoomFromPlayerId(playersId[0]);
			expectNewRoom(room, playersId[0]);

			master.createRoom(playersId[1], players[1], cb);
			room = master.getRoomFromPlayerId(playersId[1]);
			expectNewRoom(room, playersId[1]);

			master.createRoom(playersId[2], players[2], cb);
			room = master.getRoomFromPlayerId(playersId[2]);
			expectNewRoom(room, playersId[2]);
		});

		it('Shouldn\'t create room (bad clientId)', function () {
			let badRoom = undefined;
			let badPlayerId = undefined;

			master.createRoom(badPlayerId, { name: 'badId' }, cb);
			badRoom = master.getRoomFromPlayerId(badPlayerId);
			expect(badRoom).to.be.undefined;
		});

		it('Shouldn\'t create room (bad profile)', function () {
			master.createRoom(playersId[0] + 1, { name: "" }, cb);
			room = master.getRoomFromPlayerId(playersId[0] + 1);
			expect(room).to.be.undefined;

			master.createRoom(playersId[0] + 1, { name: null }, cb);
			room = master.getRoomFromPlayerId(playersId[0] + 1);
			expect(room).to.be.undefined;

			master.createRoom(playersId[0] + 1, { pseudo: "Jean" }, cb);
			room = master.getRoomFromPlayerId(playersId[0] + 1);
			expect(room).to.be.undefined;
		});
	});

	describe('Join room', () => {
		it('Should join room ', () => {
			room = master.getRoomFromPlayerId(playersId[0]);

			master.joinRoom(playersId[1] + 1, players[1], room.getUrl(), cb);
			expectJoinRoom(room, playersId[1] + 1, players[1], 2);

			master.joinRoom(playersId[2] + 1, players[2], room.getUrl(), cb);
			expectJoinRoom(room, playersId[2] + 1, players[2], 3);
		});

		it('Shouldn\'t join room (no more space available)', () => {
			master.createRoom(mainId + nbPlayer, { name: 'joueur' + nbPlayer }, cb);
			room = master.getRoomFromPlayerId(mainId + nbPlayer);
			while (++nbPlayer <= 8)
				master.joinRoom(mainId + nbPlayer, { name: 'joueur' + nbPlayer }, room.getUrl(), cb);
			let fullRoom = _.cloneDeep(room);

			master.joinRoom(667, { name: 'joueur2trop' }, room.getUrl(), cb);
			expect(master.getRoomFromPlayerId(667)).to.be.undefined;
			expect(room).to.be.eql(fullRoom);
		});
	});

	describe('Leave/delete room', () => {
		it('1 player leave room', () => {
			let roomCpy = _.cloneDeep(room);

			nbPlayer = 8;
			master.leaveRoom(mainId + nbPlayer, room.getUrl(), cb);
			expect(room).to.not.be.eql(roomCpy);
			expect(room.getNbPlayer()).eql(7);
			expect(master.getRoomFromPlayerId(mainId + nbPlayer)).to.be.undefined;
		});

		it('Delete 6 of the 7 players and give admin rights', () => {
			nbPlayer = 7;
			while (--nbPlayer > 0)
				master.leaveRoom(mainId + nbPlayer, room.getUrl(), cb);
			expect(room.getNbPlayer()).to.be.eql(1);
			expect(room.getOwner()).to.be.eql(mainId + 7);
		});

		it('Try to get a nonexistent player to leave the room', () => {
			let roomCpy = _.cloneDeep(room);

			master.leaveRoom(8566, room.getUrl(), cb);
			expect(room).to.be.eql(roomCpy);
		});

		it('Delete last player (game too)', () => {
			master.leaveRoom(mainId + 7, room.getUrl(), cb);
			room = master.getRoomFromPlayerId(mainId + 7);
			expect(room).to.be.undefined;
		});
	});
});
