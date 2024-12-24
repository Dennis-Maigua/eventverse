import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Signup from './auth/Signup';
import Signin from './auth/Signin';
import Activate from './auth/Activate';
import Forgot from './auth/Forgot';
import Reset from './auth/Reset';

import UserRoute from './utils/UserRoute';
import AdminRoute from './utils/AdminRoute';

import Profile from './core/Profile';
import CreateEvent from './core/CreateEvent';
import MyEvents from './core/MyEvents';
import MyTickets from './core/MyTickets';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import About from './pages/About';
import Contact from './pages/Contact';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/signin' element={<Signin />} />
                <Route path='/activate-account/:token' element={<Activate />} />
                <Route path='/forgot-password' element={<Forgot />} />
                <Route path='/reset-password/:token' element={<Reset />} />
                <Route element={<UserRoute />}>
                    <Route path='/profile' element={<Profile />} />
                </Route>
                <Route element={<AdminRoute />}>
                    <Route path='/admin/dashboard' element={<Dashboard />} />
                </Route>
                <Route path='/about-us' element={<About />} />
                <Route path='/contact' element={<Contact />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;