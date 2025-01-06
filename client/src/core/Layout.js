import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { isAuth, signout } from '../utils/helpers';
import Logo from '../assets/logo.png';
import Avatar from '../assets/avatar.png';

const Layout = ({ children }) => {
    const [toggled, setToggled] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return path === pathname ? 'text-red-500' : 'text-white hover:text-red-500';
    }

    const handleLogout = async () => {
        signout(() => navigate('/signin'));
    };

    return (
        <div>
            <nav className='bg-gray-900 text-white'>
                <div className='mx-auto py-4 px-4 md:px-8 flex items-center justify-between'>
                    <NavLink to='/' className='flex gap-1'>
                        <img src={Logo} className='h-7' alt='logo' />
                        <span className='text-xl font-bold'> EventVerse </span>
                    </NavLink>

                    <div className={`md:bg-transparent bg-gray-700 md:static absolute md:p-0 py-4 text-center left-0 
                        md:w-auto w-full md:flex ${toggled ? 'block top-16' : 'hidden'}`}>
                        <ul className='flex md:flex-row flex-col md:gap-8 gap-6 font-medium'>
                            <li>
                                <NavLink to='/' className={`${isActive('/')}`}> Home </NavLink>
                            </li>
                            <li>
                                <NavLink to='/events' className={`${isActive('/events')}`}> Events </NavLink>
                            </li>
                            <li>
                                <NavLink to='/about-us' className={`${isActive('/about-us')}`}> About </NavLink>
                            </li>
                            <li>
                                <NavLink to='/contact-us' className={`${isActive('/contact-us')}`}> Contact </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className='flex gap-4 font-semibold'>
                        {!isAuth() && (
                            <div className='flex gap-4'>
                                <NavLink to='/signin' className='py-1.5 px-3 text-sm text-black bg-white hover:text-red-500 shadow rounded'> Sign In </NavLink>
                            </div>
                        )}

                        {isAuth() && (
                            <div>
                                <div className='flex items-center gap-2 cursor-pointer' onClick={() => { setDropdown(!dropdown) }}>
                                    <img src={isAuth()?.profileUrl || Avatar} alt='avatar' className='h-8 w-8 rounded-full object-cover border' />
                                    <span className=''> {isAuth()?.username} </span>
                                </div>

                                {dropdown ? (
                                    <div className='bg-gray-800 absolute right-4 md:right-0 top-16 w-40 round shadow'>
                                        <ul className='flex flex-col gap-4 p-4'>
                                            {isAuth().role === 'admin' && (
                                                <li>
                                                    <NavLink to='/admin/dashboard' className={`${isActive('/admin/dashboard')}`}> Dashboard </NavLink>
                                                </li>
                                            )}
                                            <li>
                                                <NavLink to='/profile' className={`${isActive('/profile')}`}> Profile </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to='/my-events' className={`${isActive('/my-events')}`}> My Events </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to='/my-tickets' className={`${isActive('/my-tickets')}`}> My Tickets </NavLink>
                                            </li>
                                            <li>
                                                <span onClick={handleLogout} className='hover:text-red-500 cursor-pointer'> Log Out </span>
                                            </li>
                                        </ul>
                                    </div>
                                )
                                    : null}
                            </div>
                        )}

                        <button type='button' className='md:hidden px-2 rounded-lg' onClick={() => { setToggled(!toggled) }}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {!toggled ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </nav >

            <div className='min-h-screen flex-grow'>
                {children}
            </div>

            <footer className="bg-gray-900 text-white p-4 bottom-0">
                <div className="container mx-auto text-center">
                    <p className="text-sm">&copy; 2025 EventVerse. All rights reserved.</p>
                </div>
            </footer>
        </div >
    );
};

export default Layout;