import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '../core/Layout';
import { isAuth } from '../utils/helpers';

const Signup = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        buttonText: 'Create Account'
    });

    const [registered, setRegistered] = useState(false);
    const { name, email, password, buttonText } = values;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Creating...' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/account/signup`, 
                { name, email, password }
            );

            toast.success(response.data.message);
            setRegistered(true);
        }

        catch (err) {
            setValues({ ...values, buttonText: 'Create Account' });
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {isAuth() ? <Navigate to='/' /> : null}
            <div className="bg-gray-500 text-white py-16">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <h1 className="text-3xl font-bold">
                        Sign Up
                    </h1>
                </div>
            </div>

            {!registered && (
                <div className='max-w-lg m-auto text-center flex flex-col gap-4 px-4 md:px-8 py-16'>
                    <form onSubmit={handleSignup} className='p-10 flex flex-col shadow rounded gap-4 bg-slate-100'>
                        <input
                            type='text'
                            name='name'
                            value={name}
                            placeholder='Name'
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                        <input
                            type='email'
                            name='email'
                            value={email}
                            placeholder='Email'
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                        <input
                            type='password'
                            name='password'
                            value={password}
                            placeholder='Password'
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                        <input
                            type='submit'
                            value={buttonText}
                            className='py-3 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                        />
                    </form>

                    <div className='flex items-center justify-between text-sm font-medium text-gray-500 px-4'>
                        <Link to='/signin' className='hover:text-red-500'> Sign In </Link>
                        <Link to='/forgot-password' className='hover:text-red-500'> Forgot Password? </Link>
                    </div>
                </div>
            )}

            {registered && (
                <div className='max-w-lg m-auto text-center px-4 md:px-8 py-16'>
                    <h1 className='text-xl'>
                        Success! Please check your email for more instructions.
                    </h1>
                </div>
            )}

        </Layout>
    );
};

export default Signup;