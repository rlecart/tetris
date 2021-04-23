const { defaultRules } = require('./rules.js')

const defaultRoom = {
  url: '',
  inGame: false,
  nbPlayer: 0,
  listPlayers: {},
  rules: defaultRules,
}

exports.defaultRoom = defaultRoom