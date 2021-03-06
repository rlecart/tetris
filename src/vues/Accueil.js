import React, { Component } from 'react'
import { Redirect, Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import api from "../api/clientApi";
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

  componentDidMount() {
    console.log(this.props)
    console.log('rerender Accueil')
  //   if (this.props.socketConnector.isSocketConnected === true)
  //     this.props.socketConnector.socket.on('goToRoom', () => { 
  //       console.log('bjr')
  //       nav(this.props.history, `/#${this.state.roomUrl}[${this.state.profil.name}]`) })
  }

  render() {
    console.log(this.props)
    return (
      <div className="display">
        <div className="homeMenu">
          <div className="topPanel">
            <span className="title">Super Tetris 3000</span>
          </div>
          <div className="bottomPanel">
            <div className="blocMenu" id="home">
              <div className="avatarSelector">
                <div className="avatarButton" />
                <div className="avatar" />
                <div className="avatarButton" />
              </div>
              <input className='nickname' type="text" name="name" required onChange={(event) => this.handleChange(event)} />
            </div>
            <div className="blocMenu" id="home">
              <input className='roomUrl' type="text" name="roomUrl" required onChange={(event) => this.handleChange(event)} placeHolder='http://abcdef.com/absfaskfew?abc=oui' />
              <button className="roomButton" onClick={() => { api.joinRoom(this.props.socketConnector.socket, this.state.profil, this.state.roomUrl,
                                                                (path) => { nav(this.props.history, path) }) }}>
                <span className="textButton">Join room</span>
              </button>
              <button className="roomButton" onClick={() => { api.createRoom(this.props.socketConnector.socket, this.state.profil,
                                                                (path) => { nav(this.props.history, path) }) }}>
                <span className="textButton">Create Room</span>
              </button>
            </div>
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