import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Signup from './auth/Signup';
import Signin from './auth/Signin';
import Activate from './auth/Activate';
import Forgot from './auth/Forgot';
import Reset from './auth/Reset';
import Profile from './auth/Profile';

import UserRoute from './utils/UserRoute';
import AdminRoute from './utils/AdminRoute';

import Dashboard from './components/Dashboard';
import CreateEvent from './components/CreateEvent';
import MyEvents from './components/MyEvents';
import MyTickets from './components/MyTickets';

import Home from './pages/Home';
import AllEvents from './pages/AllEvents';
import EventDetails from './pages/EventDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Web3 from './pages/Web3';

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
                    <Route path='/create-event' element={<CreateEvent />} />
                    <Route path='/my-events' element={<MyEvents />} />
                    <Route path='/my-tickets' element={<MyTickets />} />
                </Route>
                <Route element={<AdminRoute />}>
                    <Route path='/admin/dashboard' element={<Dashboard />} />
                </Route>
                <Route path='/events' element={<AllEvents />} />
                <Route path='/event/:id' element={<EventDetails />} />
                <Route path='/about-us' element={<About />} />
                <Route path='/contact-us' element={<Contact />} />
                <Route path='/web3' element={<Web3 />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;