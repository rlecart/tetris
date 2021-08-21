// let Master = require('../server/classes/Master.js')
// var master = new Master();
//var expect = require('chai').expect
let { expect } = require('chai')
let _ = require('lodash')

let { expectNewRoom, expectJoinRoom, getGameFromPlayerId } = require('./utils.js');
let { defaultRules } = require('../src/ressources/rules.js')

//Nom du fichier dans lequel se trouves les fonctions testé
describe('Room Tests', () => {

	let master
	var cb = () => { console.log('Callback') };
	const playersId = [475, 307, 18446744073709551615];
	const players = [{ name: 'Hector' }, { name: '\t\n\r\v\f' }, { name: 'pouayayay' }];
	let room = {};
	let badRoom = {}
	let master
	//let sock = openSocket('http://localhost:8000')

	before(() => {
		master = require('../server/server')
		// master.startServer()
	})
	//Nom de la fonction a tester
	describe('[ROOM CREATE]', () => {
		//Explication de se que devrait retournner la fonction
		it('Devrait créer la room', () => {
			//Nom: normal | Id: normal
			master.createRoom(playersId[0], players[0], cb);
			room = getGameFromPlayerId(playersId[0], master);
			expectNewRoom(room, playersId[0])
			//Nom: tnrvf | Id: normal
			master.createRoom(playersId[1], players[1], cb);
			expectNewRoom(getGameFromPlayerId(playersId[1], master), playersId[1]);
			//Nom: normal | Id: long
			master.createRoom(playersId[2], players[2], cb);
			expectNewRoom(getGameFromPlayerId(playersId[2], master), playersId[2]);
		});

		it('Ne Devrait pas créer la room (Mauvais clientId)', function () {
			var badPlayerId = undefined
			master.createRoom(badPlayerId, { name: 'badId' }, cb);
			badRoom = getGameFromPlayerId(badPlayerId, master)
			expect(badRoom).to.be.undefined
		})

		it('Ne Devrait pas créer la room (Mauvais profil)', function () {
			//Nom: empty name
			master.createRoom(playersId[0], { name: "" }, cb);
			expectNewRoom(getGameFromPlayerId(playersId[0], master), playersId[0]);
			//Nom: name null
			master.createRoom(playersId[0], { name: null }, cb);
			expectNewRoom(getGameFromPlayerId(playersId[0], master), playersId[0]);
			//Bad profil object (missing 'name')
			master.createRoom(playersId[0], { pseudo: "Jean" }, cb);
			expectNewRoom(getGameFromPlayerId(playersId[0], master), playersId[0]);

		})

	})

	var mainId = 2100
	var nbPlayer = 1

	describe('[ROOM JOINED]', () => {

		it('Devrait join la room ', () => {
			//Player 1 rejoint la game crée par le joueur 0
			master.joinRoom(playersId[1], players[1], room.getUrl(), cb);
			expectJoinRoom(room, playersId[1], players[1], 2);
			//Player 2 rejoint la game crée par le joueur 0
			master.joinRoom(playersId[2], players[2], room.getUrl(), cb);
			expectJoinRoom(room, playersId[2], players[2], 3);

		});

		it('Ne devrait pas join la room (8 jooueurs déja présent)', () => {
			//crée une nouvelle game pour la remplir de joueur
			master.createRoom(mainId + nbPlayer, { name: 'joueur' + nbPlayer }, cb);
			room = getGameFromPlayerId(mainId + nbPlayer, master);
			while (++nbPlayer <= 8) {
				master.joinRoom(mainId + nbPlayer, { name: 'joueur' + nbPlayer }, room.getUrl(), cb);
			}
			var fullRoom = _.cloneDeep(room);
			//Essaye d'ajouter un joueur qui n'a pas de place dans la room
			master.joinRoom(667, "joueur2trop", room.getUrl(), cb);
			expect(getGameFromPlayerId(667, master)).to.be.undefined;
			expect(room).to.be.eql(fullRoom);
		});

	})

	describe('[ROOM DELETE]', () => {

		it('Supprime 7 des 8 joueurs et transfert les droits d\'admin', () => {
			nbPlayer = 8
			//retire tout les joueurs sauf  l'admin et le dernier à rejoindre la partie
			while (--nbPlayer > 0) {
				master.leaveRoom(mainId + nbPlayer, { name: 'joueur' + nbPlayer }, room.getUrl(), cb);
			}
			expect(room.getNbPlayer()).to.be.eql(1);
			expect(room.getOwner()).to.be.eql(mainId + 8);

			//Supprime un joueur qui n'existe pas
			var fullRoom = _.cloneDeep(room);
			master.leaveRoom(8566, { name: 'Home invisible' }, room.getUrl(), cb);
			expect(room).to.be.eql(fullRoom);
		});

		it('Supprime le dernier joueur (donc la game)', () => {
			//console.log(room.getUrl())
			master.leaveRoom(mainId + 8, { name: 'joueur' + 8 }, room.getUrl(), cb);
			room = getGameFromPlayerId(mainId + 8, master)
			expect(room).to.be.undefined
		})

	});

	after(() => {
		// master.getServer().getIoServer()
		//socket.disconnect()
		// master.stopServer()
	})
});
