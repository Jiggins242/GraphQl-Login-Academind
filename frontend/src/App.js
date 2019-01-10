import React, { Component } from 'react'
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'

import PatientsPage from './pages/Patients';
import EventsPage from './pages/Events';
import BookingPage from './pages/Bookings';
import AuthPage from './pages/Auth'

import './App.css';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect from="/" to="/auth" exact />
          <Route path="/auth" component={AuthPage} />
          <Route path="/patients" component={PatientsPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/bookings" component={BookingPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
