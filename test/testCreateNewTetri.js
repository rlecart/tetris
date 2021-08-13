// // test createNewTetri(game, room)
// //
// // c'est une fonction qui va avancer de 1 l'index tetri du joueur
// // par rapport au tableau de tetri de la room (ou il en est quoi)
// //
// // si il est au bout du tableau (enfin n -1 vu qu'il y a toujours
// // la piece NEXT), il en créé un nouveau
//
// // (j'ai pas encore refacto en objet 'Tetri' donc c'est fait un
// // peu "a la zeub")
//
// const clonedeep = require('lodash.clonedeep')
// const tetriminos = require('../src/ressources/tetriminos')
// const { Room } = require('../server/classes/Room')
//
// const setupRoom = () => {
//     let room = new Room()
//
//     room.setUrl('bonjour')
//     room.addNewPlayer(42, { name: 'patrik' })
//     room.setInGame(true)
//     room.addNewShape(clonedeep(tetriminos.tetriminos[1]))
//     room.addShapesId(3)
//     room.addNewShape(clonedeep(tetriminos.tetriminos[2]))
//     room.addShapesId(4)
//     return (room)
// }
//
// // room.getRoomInfo() pour choper un objet avec toutes les variables dedans
//
// const comparaison = {
//     url: 'bonjour',
//     inGame: true,
//     nbPlayer: 1,
//     listPlayers: {
//         42: { name: 'patrik' },
//     },
//     rules: clonedeep(defaultRules),
//     interval: undefined,
//     shapes: [],
//     shapesId: [],
//     readyToStart: {},
// }
