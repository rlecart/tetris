
//chemin du fichier contenant les fonctions à tester depuis la racine du project
var filePath = "src/server/refresh.js"

var functionsNames = [ "createNewTetri" ]
var functionsTests
var createNewTetri = require("../" + filePath)
//Librairie nécessaire pour comparé les résultats des fonctions aux
//l'objets attendu
var assert = require('assert')

//Nom du fichier dans leauel se trouves les fonctions testé
describe('Test de src/server/refresh.js', function(){
  //Nom de la fonction a tester
  describe('[createNewTetri] création d\'un nouveau Tétriminos', function(){
    //Explication de se que devrait retournner la fonction
    it('Devrait créer le Tétriminos', function(){
      assert.equal(1, 1)
    })

  })

})
