import Master from "../server/classes/Master.mjs"
var master = new Master()
//var expect = require('chai').expect
import {getGameFromPlayerId} from "./utils.mjs"
import { expect } from 'chai'


//Nom du fichier dans lequel se trouves les fonctions testé
describe('!! ', function(){

  var cb = () => { console.log("Callback") }
  //let sock = openSocket('http://localhost:8000')
  //Nom de la fonction a tester
  describe('[createRoom] création d\'un nouveau Tétriminos', function(){

    //Explication de se que devrait retournner la fonction
    it('Devrait créer le Tétriminos', function(){

      master.createRoom(475, { name: "Hector" }, cb)
      var room = getGameFromPlayerId(475, master)
      console.log(room)
      //allRooms.prototype.forEach((game) => { console.log(game) })

      //console.log(allRooms)
      //console.log(allRooms.map((data) => { console.log(data) }))

      expect(room).to.exist
      //expect(room._nbPlayer).to.equal(1)
      //Ajouter des vérification a game.

      //expect(master.createRoom(472, { name: "\t\n\r\v\f" }, cb)).to.exist
      //expect(master.createRoom(18446744073709551615, { name: "Hector" }, cb)).to.exist
    })

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

  })

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

})
