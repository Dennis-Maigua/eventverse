import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { isAuth, signout } from '../utils/helpers';
import Logo from '../assets/logo.png';
import Avatar from '../assets/avatar.png';

const Layout = ({ children }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [toggled, setToggled] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    const isActive = (path) => {
        return path === pathname ? 'text-red-500' : 'text-white hover:text-red-500';
    }

    const handleLogout = async () => {
        signout(() => {
            navigate('/signin');
        });
    };

    return (
        <div>
            <nav className='bg-gray-900 text-white'>
                <div className='max-w-7xl mx-auto px-4 py-6 flex items-center justify-between'>
                    <NavLink to='/' className='flex gap-2'>
                        <img src={Logo} className='h-8' alt='logo' />
                        <span className='text-2xl font-bold'> EventVerse </span>
                    </NavLink>

                    <div className={`md:bg-transparent bg-gray-800 md:static absolute md:p-0 py-6 text-center left-0 
                        md:w-auto w-full md:flex ${toggled ? 'block top-20' : 'hidden'}`}>
                        <ul className='flex md:flex-row flex-col md:gap-8 gap-6 font-medium'>
                            <li>
                                <NavLink to='/' className={`${isActive('/')}`}> Home </NavLink>
                            </li>

                            {!isAuth() ? (
                                <li>
                                    <NavLink to='/signin' className={`${isActive('/sign-in')}`}> Events </NavLink>
                                </li>
                            ) : (
                                <li>
                                    <NavLink to='/' className={`${isActive('/')}`}> Events </NavLink>
                                </li>
                            )}
                            <li>
                                <NavLink to='/about-us' className={`${isActive('/about-us')}`}> About Us </NavLink>
                            </li>
                            <li>
                                <NavLink to='/contact' className={`${isActive('/contact')}`}> Contact </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className='flex gap-4 font-semibold'>
                        {!isAuth() && (
                            <div className='flex gap-4'>
                                <NavLink to='/signin' className='py-2 px-3 text-black bg-white hover:text-red-500 shadow rounded'> Sign In </NavLink>
                            </div>
                        )}

                        {isAuth() && (
                            <div>
                                <div className='flex items-center gap-2 cursor-pointer' onClick={() => { setDropdown(!dropdown) }}>
                                    <img src={isAuth().profile || Avatar} alt='avatar' className='h-8 w-8 rounded-full object-cover border' />
                                    <span className=''> {isAuth().name} </span>
                                </div>


                                {dropdown ? (
                                    <div className='bg-gray-800 absolute right-0 top-20 w-40 round shadow'>
                                        <ul className='flex flex-col gap-6 p-6'>
                                            {isAuth().role === 'admin' && (
                                                <li>
                                                    <NavLink to='/admin/dashboard' className={`${isActive('/admin/dashboard')}`}> Dashboard </NavLink>
                                                </li>
                                            )}
                                            <li>
                                                <NavLink to='/profile' className={`${isActive('/profile')}`}> Profile </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to='/' className={`${isActive('/')}`}> History </NavLink>
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
                    <p className="text-sm">&copy; 2024 EventVerse. All rights reserved.</p>
                </div>
            </footer>
        </div >
    );
};

export default Layout;