const { defaultRules } = require('./rules.js')

const defaultRoom = {
  url: '',
  nbPlayer: 0,
  listPlayers: {},
  rules: defaultRules,
}

exports.defaultRoom = defaultRoom