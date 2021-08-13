
//Chemin vers le dossier du ficher possédant les fonctions à tester
var filePath = 'server/'
//Nom du ficher possédant les fonctions à tester
var fileName = 'server'
//Import des fonctionds à tester
var ftImported = require('../' + filePath + fileName)

//Librairie nécessaire pour comparé les résultats des fonctions aux
//l'objets attendu
var expect = require('chai').expect

//Nom du fichier dans lequel se trouves les fonctions testé
describe('Test de ' + filePath + fileName, function(){
  //Nom de la fonction a tester
  describe('[createRoom] création d\'un nouveau Tétriminos', function(){

    var cb = () => { }
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

})
