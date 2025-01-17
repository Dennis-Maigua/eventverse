import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '../components/Layout';
import { isAuth } from '../utils/AuthHelpers';

const Forgot = () => {
    const [values, setValues] = useState({
        email: '',
        buttonText: 'Send Link'
    });

    const [requested, setRequested] = useState(false);
    const { email, buttonText } = values;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const clickSubmit = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Sending...' });

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/password/forgot`, 
                { email }
            );

            setRequested(true);
            toast.success(response.data.message);
        }

        catch (err) {
            setValues({ ...values, buttonText: 'Send Link' });
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {isAuth() ? <Navigate to='/' /> : null}
            <div className="bg-gray-500 text-white py-20">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <h1 className="text-3xl font-bold">
                        Forgot Password
                    </h1>
                </div>
            </div>

            {!requested && (
                <div className='max-w-lg m-auto text-center flex flex-col gap-4 px-4 md:px-8 py-8'>
                    <form onSubmit={clickSubmit} className='p-10 flex flex-col border shadow-lg rounded-lg gap-4 bg-slate-100'>
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
                            className='py-2 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                        />
                    </form>

                    <div className='flex items-center justify-between text-sm font-medium text-gray-500 px-4'>
                        <Link to='/signin' className='hover:text-red-500'> Sign In </Link>
                        <Link to='/signup' className='hover:text-red-500'> Sign Up </Link>
                    </div>
                </div>
            )}

            {requested && (
                <div className='max-w-lg m-auto text-center px-4 md:px-8 py-12'>
                    <h1 className='text-xl'>
                        Success! Please check your email for more instructions.
                    </h1>
                </div>
            )}
        </Layout>
    );
};

export default Forgot;