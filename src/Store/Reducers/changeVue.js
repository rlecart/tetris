function changeVue(state, action) {
    let nextState
    switch(action.type) {
        case 'TOGGLE_FAVORITE':
            console.log('TOGGLE_FAVORITE')
            return nextState || state
        default:
            return state
    }
}

export default changeVue