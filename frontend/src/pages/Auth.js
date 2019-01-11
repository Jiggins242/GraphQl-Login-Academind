
import React, { Component } from 'react';

import '../styles/Auth.css'

class AuthPage extends Component {

  state = {
    isLogin: true
  }

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

      if (!this.state.isLogin) {
         requestBody = {
          query: `
          mutation {
            createUser(userInput: {username:"${username}", password:"${password}"}){
              _id
              username
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
        console.log(resData)
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