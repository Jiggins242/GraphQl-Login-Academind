
import React, { Component } from 'react';
import AuthContext from '../context/auth-context'

import '../styles/Auth.css'

class AuthPage extends Component {

  state = {
    isLogin: true
  }

// React behind the scenes will conect up the logic of the two 
  static contextType = AuthContext

//Using React Refrences to fetch the API requests
  constructor(props) {
    super(props)
    // Is the full username Element - is connected to input in form username 
    // And the full password Element - is connected to input in form password 
    this.usernameEl = React.createRef()
    this.passwordEl = React.createRef()
  }

    switchModeHandler = () => {
      this.setState(prevState => {
        return {isLogin: !prevState.isLogin}
      })
    }

    submitHandler = event => { 
      event.preventDefault()
      const username = this.usernameEl.current.value
      const password = this.passwordEl.current.value

      // Validation check to see if any input given
      if (username.trim().length === 0 || password.trim().length === 0) {
        // If nothing just return
        return
      }
      // If we are on the login section 
      // We will use this mutation to login 
      let requestBody = {
        query:`
          query {
            login(username: "${username}", password: "${password}") {
              userId
              token
              tokenExpiration
            }
          }
        `
      }
      // If we are not on the Login function 
      // We will use this mutation instead, this will create a user
      if (!this.state.isLogin) {
         requestBody = {
          query: `
          mutation {
            createUser(userInput: {username:"${username}", password:"${password}"}){
              _id
              username
              user{
                id
                forn
              }
            }
          }
          `
        }
      }

      // We pass in an argument to configuire the request as the default is Get request 
      fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.status !==200 && res.status !==201) {
          throw new Error('Failed')
        }
        return res.json()
      })
      .then(resData => {
        if (resData.data.login.token) {
          this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration)
        }
      })
      .catch(err => {
        console.log(err)
      })
    }

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" ref={this.usernameEl}></input>
        </div>
        <div className="form-control">
          <label htmlFor="Password">Password</label>
          <input type="password" id="password" ref={this.passwordEl}></input>
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
        </div>
      </form>
    )
  }
}

export default AuthPage;