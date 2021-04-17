import React, { Component } from 'react'
import { Redirect, Link, useHistory } from 'react-router-dom'
import { redirectTo } from '../api/serverApi'
import { connect } from 'react-redux'
import { createRoom, joinRoom } from "../api/clientApi";
import nav from '../misc/nav'

class Accueil extends Component {
  state = {
    profil: {
      name: '',
    },
    roomUrl: '',
  }

  handleChange(event) {
    let state = this.state
    console.log(event)
    if (event.target.name === 'name')
      state.profil.name = event.target.value
    else if (event.target.name === 'roomUrl')
      state.roomUrl = event.target.value
    this.setState(state)
  }

    
  render() {
    return (
      <div className="v9_11">
        <div className="v9_12">
          <div className="v11_25">
            <div className="v9_22">
              <input className='v11_5' type="text" name="name" required onChange={(event) => this.handleChange(event)} />
              <div className="v11_4">
              </div>
              <div className="v11_8">
              </div>
              <div className="v11_113">
              </div>
            </div>
            <div className="name">
            </div>
            <div className="v11_26">
              <input className='v11_32' type="text" name="roomUrl" required onChange={(event) => this.handleChange(event)} placeHolder='http://abcdef.com/absfaskfew?abc=oui' />
                <button className="v11_33" onClick={() => { joinRoom(this.props.socket, this.state.profil, this.state.roomUrl, (path) => { nav(this.props.history, path) }) }}>
                  <span className="v11_38">Join room</span>
                </button>
              <button className="v11_34" onClick={() => { createRoom(this.props.socket, this.state.profil, (path) => { nav(this.props.history, path) }) }}>
                <span className="v11_110">Create Room</span>
              </button>
            </div>
          </div>
          <div className="v11_1">
          </div>
          <div className="v11_2">
          </div>
          <div className="v11_9">
            <span className="v10_5">Super Tetris 3000</span>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state
}
// export default connect(mapStateToProps)(Accueil)
export default Accueil