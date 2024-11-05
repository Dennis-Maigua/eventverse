import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../core/Layout';
import { isAuth } from '../utils/helpers';

const Signup = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        buttonText: 'Submit'
    });

    const [registered, setRegistered] = useState(false);
    const { name, email, password, buttonText } = values;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const clickSubmit = async (event) => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Submitting...' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/signup`, { name, email, password }
            );

            console.log('USER SIGNUP SUCCESS:', response);
            setValues({ ...values, name: '', email: '', password: '', buttonText: 'Submitted' });
            toast.success(response.data.message);

            setRegistered(true);
        }

        catch (err) {
            console.log('USER SIGNUP FAILED:', err);
            setValues({ ...values, buttonText: 'Submit' });
            toast.error(err.response.data.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {isAuth() ? <Navigate to='/' /> : null}
            <div className="bg-gray-600 text-white py-14">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold mb-2">
                        Sign Up
                    </h1>
                </div>
            </div>

            {!registered && (
                <div className='max-w-lg m-auto text-center flex flex-col gap-4 px-4 py-14'>
                    <form onSubmit={clickSubmit} className='p-10 flex flex-col shadow rounded gap-4 bg-slate-100'>
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

                    <div className='px-5 flex items-center justify-between font-medium text-gray-500'>
                        <Link to='/signin' className='hover:text-red-500'> Sign In </Link>
                        <Link to='/forgot-password' className='hover:text-red-500'> Forgot Password? </Link>
                    </div>
                </div>
            )}

            {registered && (
                <div className='max-w-lg m-auto text-center px-4 py-14'>
                    <h1 className='text-2xl'>
                        Success! Please check your email for more instructions...
                    </h1>
                </div>
            )}

        </Layout>
    );
};

export default Signup;