
//Chemin vers le dossier du ficher possédant les fonctions à tester
var filePath = 'server/'
//Nom du ficher possédant les fonctions à tester
var fileName = 'server'
//Import des fonctionds à tester
var ftImported = require('../' + filePath + fileName)

//Librairie nécessaire pour comparé les résultats des fonctions aux
//l'objets attendu
var expect = require('chai').expect

//import openSocket from 'socket.io-client'
var openSocket = require('socket.io-client')
//Nom du fichier dans lequel se trouves les fonctions testé
describe('Test de ' + filePath + fileName, function(){

  var cb = () => { }
  //let sock = openSocket('http://localhost:8000')
  //Nom de la fonction a tester
  describe('[createRoom] création d\'un nouveau Tétriminos', function(){

    //Explication de se que devrait retournner la fonction
    it('Devrait créer le Tétriminos', function(){

      room = ftImported.createRoom(475, { name: "Hector" }, cb)
      expect(room).to.exist
      //expect(room._nbPlayer).to.equal(1)
      //Ajouter des vérification a game.

      expect(ftImported.createRoom(472, { name: "\t\n\r\v\f" }, cb)).to.exist
      expect(ftImported.createRoom(18446744073709551615, { name: "Hector" }, cb)).to.exist
    })

    it('Ne Devrait pas créer le Tétriminos (Mauvais clientId)', function(){
      expect(ftImported.createRoom(0, { name: "Hector" }, cb)).to.exist
      expect(ftImported.createRoom(-543, { name: "Hector" }, cb)).to.exist
      expect(ftImported.createRoom(null, { name: "Hector" }, cb)).to.exist
    })

    it('Ne Devrait pas créer le Tétriminos (Mauvais profil)', function(){
      expect(ftImported.createRoom(472, { name: "" }, cb)).to.exist
      expect(ftImported.createRoom(472, { name: null }, cb)).to.exist
      expect(ftImported.createRoom(472, { pseudo: "Jean" }, cb)).to.exist
      expect(ftImported.createRoom(472, null, cb)).to.exist
    })

  })

  describe('[joinRoom] connection à la room crée', function(){

     //création de la "room" à laquel le joueur va essayer de se connecter
     let room = ftImported.createRoom(667, { name: "Hector" }, cb)

     it('Devrait se connecter à la room', function(){
       ftImported.joinRoom(1, { name: "PasHector2" }, room.getUrl(), cb)
       expect(room._listPlayers[667]._clientId).to.equal(667)

     })

  })

})
