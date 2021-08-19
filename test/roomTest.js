// import Master from '../server/classes/Master.mjs';
import master from '../server/server.mjs'
// var master = new Master();
//var expect = require('chai').expect
import { getGameFromPlayerId } from './utils.mjs';
import { expect } from 'chai';
import { defaultRules } from '../src/ressources/rules.mjs'

//Nom du fichier dans lequel se trouves les fonctions testé
describe('!! ', () => {
	var cb = () => {
		console.log('Callback');
	};
	// master.startServer()
	//let sock = openSocket('http://localhost:8000')
	//Nom de la fonction a tester
	describe('[ROOM TESTS]', () => {
		const playersId = [ 475, 307, 888 ];
		const players = [ { name: 'Hector' }, { name: 'maisquoiOMG' }, { name: 'pouayayay' } ];
		let room = {};

		//Explication de se que devrait retournner la fonction
		it('Devrait créer la room', () => {
			master.createRoom(playersId[0], players[0], cb);
			room = getGameFromPlayerId(475, master);
      console.log(room)
			// console.log(room)
			//allRooms.prototype.forEach((game) => { console.log(game) })

			//console.log(allRooms)
			//console.log(allRooms.map((data) => { console.log(data) }))
      expect(room.isInGame()).to.be.eql(false)
      expect(room).to.exist;
      expect(room.getNbPlayer()).to.be.eql(1)
      expect(room.getRules()).to.be.eql(defaultRules)
      expect(room.getInterval()).to.be.eql(undefined)
      expect(room.getShapes()).to.be.eql([])
      expect(room.getShapesId()).to.be.eql([])
      expect(room.getReadyToStart()).to.be.eql({})
      expect(room.getReadyToStart()).to.be.eql({})
      expect(room.getOwner()).to.be.eql(playersId[0])
      expect(room.getArrivalOrder()).to.be.eql([ playersId[0] ])
			//expect(room._nbPlayer).to.equal(1)
			//Ajouter des vérification a game.

			//expect(master.createRoom(472, { name: "\t\n\r\v\f" }, cb)).to.exist
			//expect(master.createRoom(18446744073709551615, { name: "Hector" }, cb)).to.exist
		});
		it('Devrait join la room ', () => {
			master.joinRoom(playersId[1], players[1], room.getUrl(), cb);
			expect(room.getListPlayers(playersId[1]).getId()).to.be.equal(playersId[1]);
			expect(room.getListPlayers(playersId[1]).getProfil()).to.eql({
				...players[1],
				url: room.getUrl(),
				owner: false
      });

      expect(room.getNbPlayer()).to.be.eql(2)
			master.joinRoom(playersId[2], players[2], room.getUrl(), cb);
			expect(room.getListPlayers(playersId[2]).getId()).to.be.equal(playersId[2]);
			expect(room.getListPlayers(playersId[2]).getProfil()).to.eql({
				...players[2],
				url: room.getUrl(),
				owner: false
			});
      expect(room.getNbPlayer()).to.be.eql(3)

		});

		// it('Ne Devrait pas créer le Tétriminos (Mauvais clientId)', function(){
		//   expect(master.createRoom(0, { name: "Hector" }, cb)).to.exist
		//   expect(master.createRoom(-543, { name: "Hector" }, cb)).to.exist
		//   expect(master.createRoom(null, { name: "Hector" }, cb)).to.exist
		// })
		//
		// it('Ne Devrait pas créer le Tétriminos (Mauvais profil)', function(){
		//   expect(master.createRoom(472, { name: "" }, cb)).to.exist
		//   expect(master.createRoom(472, { name: null }, cb)).to.exist
		//   expect(master.createRoom(472, { pseudo: "Jean" }, cb)).to.exist
		//   expect(master.createRoom(472, null, cb)).to.exist
		// })
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
	master.stopServer()
});
