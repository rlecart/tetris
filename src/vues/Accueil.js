import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'

class Accueil extends Component {

  createRoom = () => {
    <Link to='/room'>
      <Redirect push to='/room' />
    </Link>
  }

  render() {
    return (
      <div className="v9_11">
        <div className="v9_12">
          <div className="v11_25">
            <div className="v9_22">
              <input className='v11_5' type="text" name="name" required />
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
              <div className="v11_32">
                <span className="v11_37">http://abcdef.com/absfaskfew?abc=oui</span>
              </div>
              <button className="v11_33" onClick={() => this.createRoom()}>
                <span className="v11_38">Join room</span>
              </button>
              <button className="v11_34" onClick={() => this.createRoom()}>
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

export default Accueil