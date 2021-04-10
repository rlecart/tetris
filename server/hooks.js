const move = (dir) => {
    if (dir == 'right')
        refresh.moveTetri(game.game, 1, 0)
    else if (dir == 'left')
        refresh.moveTetri(game.game, -1, 0)
    client.emit('refreshVue', game.game)
}

exports.move = move