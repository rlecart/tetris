import Master from '../server/classes/Master.mjs';
var master = new Master();

import { expect } from 'chai';

import { expectNewRoom, expectJoinRoom, getGameFromPlayerId } from './utils.mjs';
import { defaultRules } from '../src/ressources/rules.mjs'

//Nom du fichier dans lequel se trouves les fonctions testé
describe('Server Tests', () => {

	var cb = () => {
		console.log('Callback');
	};
	const playersId = [ 475, 307, 18446744073709551615 ];
	const players = [{ name: 'Hector' }, { name: '\t\n\r\v\f' }, { name: 'pouayayay' } ];
	let room = {};
	let badRoom = {}
	//let sock = openSocket('http://localhost:8000')

	//Nom de la fonction a tester
	describe('[ROOM TESTS]', () => {
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

		it('Ne Devrait pas créer la room (Mauvais clientId)', function(){
			var badPlayerId = undefined
			master.createRoom(badPlayerId, { name: 'badId' }, cb);
			badRoom = getGameFromPlayerId(badPlayerId, master)
			expect(badRoom).to.be.undefined
		})

		it('Ne Devrait pas créer la room (Mauvais profil)', function(){
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

		it('Devrait join la room ', () => {
			//Player 1 rejoint la game crée par le joueur 0
			master.joinRoom(playersId[1], players[1], room.getUrl(), cb);
			expectJoinRoom(room, playersId[1], players[1], 2);
			//Player 2 rejoint la game crée par le joueur 0
			master.joinRoom(playersId[2], players[2], room.getUrl(), cb);
			expectJoinRoom(room, playersId[2], players[2], 3);
		});

		it('Ne devrait pas join la room (8 jooueurs déja présent)', () => {
			var nbPlayer = 1
			//crée une nouvelle game pour la remplir de joueur
			master.createRoom(2100 + nbPlayer, { name: 'admin' }, cb);
			room = getGameFromPlayerId(2100, master);
			while (++nbPlayer <= 8) {
				master.joinRoom(2100 + nbPlayer, { name: 'joueur' + nbPlayer }, room.getUrl(), cb);
			}
			var fullRoom = room;
			//Essaye d'ajouter un joueur qui n'a pas de place dans la room
			master.joinRoom(667, "joueur2trop", room.getUrl(), cb);
			expect(getGameFromPlayerId(667, master)).to.be.undefined;
			expect(room).to.be.eql(fullRoom);
		});

		it('Supprime 7 des 8 joueurs', () => {
			//leaveRoom

		}






	});

	// describe('[joinRoom] connection à la room crée', function(){
	//
	//    //création de la "room" à laquel le joueur va essayer de se connecter
	//    let room = master.createRoom(667, { name: "Hector" }, cb)
	//
	//    it('Devrait se connecter à la room', function(){
	//      master.joinRoom(1, { name: "PasHector2" }, room.getUrl(), cb)
	//      expect(room._listPlayers[667]._clientId).to.equal(667)
	//
	//    })
	//
	// })
});
