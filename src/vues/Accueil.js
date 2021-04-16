import React, { Component } from 'react'
import { Redirect, Link, useHistory } from 'react-router-dom'
import { redirectTo } from '../api/serverApi'
import { connect } from 'react-redux'
import { createRoom } from "../api/clientApi";

function GoToCreateRoom(props, state) {
  const history = useHistory()

  // function handleClick(props, state) {
  //   createRoom(props.socket, state.profil, () => { history.push('/room?abc') })
  // }
  // return (
  //   <button className="v11_34" onClick={() => { handleClick(props, state) }}>
  //     <span className="v11_110">Create Room</span>
  //   </button>
  // )
}

class Accueil extends Component {
  state = {
    profil: {
      id: -1,
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

  handleClick() {
    // createRoom(this.props.socket, this.state.profil)
    return <Redirect push to='/aefwa'/>
  }

  render() {
    console.log(this.state.profil)
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
              <Link to='/room'>
                <button className="v11_33" onClick={() => redirectTo('/room')}>
                  <span className="v11_38">Join room</span>
                </button>
              </Link>
              {/* <Link to={`/room?${this.state.profil.name}`}> */}
              <button type='submit' className="v11_34" onSubmit={this.handleClick}>
                <span className="v11_110">Create Room</span>
              </button>
              {/* {<GoToCreateRoom props={this.props} state={this.state} />} */}
              {/* </Link> */}
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
export default connect(mapStateToProps)(Accueil)