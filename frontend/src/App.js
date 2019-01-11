import React, { Component } from 'react'
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'

import AuthPage from './pages/Auth'
import PatientsPage from './pages/Patients';
import EventsPage from './pages/Events';
import BookingPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation'

import './styles/App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              <Redirect from="/" to="/auth" exact />
              <Route path="/auth" component={AuthPage} />
              <Route path="/patients" component={PatientsPage} />
              <Route path="/events" component={EventsPage} />
              <Route path="/bookings" component={BookingPage} />
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
