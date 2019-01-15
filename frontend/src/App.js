import React, { Component } from 'react'
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'

import AuthPage from './pages/Auth'
import PatientsPage from './pages/Patients'
import EventsPage from './pages/Events'
import BookingPage from './pages/Bookings'
import LandingPage from './pages/Landing'
import MainNavigation from './components/Navigation/MainNavigation'
import AuthContext from './context/auth-context'

import './styles/App.css';

class App extends Component {

  state ={
    token: null,
    userId: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId})
  }

  logout = () => {
    this.setState({ token:null, userId: null})
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider 
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout }}>
            <MainNavigation />
              <main className="main-content">
                <Switch>
                  {!this.state.token && <Redirect from="/" to="/auth" exact />}
                  {this.state.token && <Redirect from="/" to="/landing" exact />}
                  {this.state.token && <Redirect from="/auth" to="/landing" exact />}

                  {!this.state.token && <Route path="/auth" component={AuthPage} />}
                  {this.state.token && <Route path="/patients" component={PatientsPage} />}
                  {this.state.token && <Route path="/events" component={EventsPage} />}
                  {this.state.token && <Route path="/bookings" component={BookingPage} />}
                  {this.state.token && <Route path="/landing" component={LandingPage} />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
