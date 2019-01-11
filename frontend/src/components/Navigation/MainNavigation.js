import React from 'react'
import {NavLink} from 'react-router-dom'

import './MainNavigation.css'

const mainNavigation = props => (
    <header className="main-navigation">
        <div className="main-navigation__logo">
            <h1>Hot FUS</h1>
        </div>
        <nav className="main-navigation__items">
            <ul>
                <li><NavLink to="/patients">Patients</NavLink></li>
                <li><NavLink to="/events">Events</NavLink></li>
                <li><NavLink to="/bookings">Bookings</NavLink></li>
                <li><NavLink to="/auth">Login</NavLink></li>
            </ul>
        </nav>
    </header>
)

export default mainNavigation;