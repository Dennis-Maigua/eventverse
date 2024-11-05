import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../core/Layout';
import { isAuth } from '../utils/helpers';

const Forgot = () => {
    const [values, setValues] = useState({
        email: '',
        buttonText: 'Request Reset Link'
    });

    const [requested, setRequested] = useState(false);
    const { email, buttonText } = values;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const clickSubmit = async (event) => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Requesting...' });

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/forgot-password`, { email }
            );

            console.log('SEND RESET LINK SUCCESS:', response);

            setValues({ ...values, email: '', buttonText: 'Requested' });
            toast.success(response.data.message);

            setRequested(true);
        }

        catch (err) {
            console.log('SEND RESET LINK FAILED:', err);
            setValues({ ...values, buttonText: 'Request Reset Link' });
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
                        Forgot Password
                    </h1>
                </div>
            </div>

            {!requested && (
                <div className='max-w-lg m-auto text-center flex flex-col gap-4 px-4 py-14'>
                    <form onSubmit={clickSubmit} className='p-10 flex flex-col shadow rounded gap-4 bg-slate-100'>
                        <input
                            type='email'
                            name='email'
                            value={email}
                            placeholder='Email'
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
                        <Link to='/signup' className='hover:text-red-500'> Sign Up </Link>
                    </div>
                </div>
            )}

            {requested && (
                <div className='max-w-lg m-auto text-center px-4 py-14'>
                    <h1 className='text-2xl'>
                        Success! Please check your email for more instructions...
                    </h1>
                </div>
            )}
        </Layout>
    );
};

export default Forgot;