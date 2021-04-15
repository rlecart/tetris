function anotherOnePlease(socket, cb) {
    socket.emit('anotherOnePlease', cb)
}

function move(dir, socket) {
    socket.emit('move', dir, () => { console.log('move envoye') })
}

export { anotherOnePlease, move }