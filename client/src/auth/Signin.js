import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '../core/Layout';
import { authenticate, isAuth } from '../utils/helpers';

const Signin = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        buttonText: 'Login'
    });

    const navigate = useNavigate();
    const { email, password, buttonText } = values;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const clickSubmit = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Logging in...' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/account/signin`, 
                { email, password }
            );

            authenticate(response, () => {
                toast.success(response.data.message);
                isAuth() && isAuth().role === 'admin' ? navigate('/admin/dashboard') : navigate('/profile');
            });
        }

        catch (err) {
            setValues({ ...values, buttonText: 'Login' });
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
                        Sign In
                    </h1>
                </div>
            </div>

            <div className='max-w-lg m-auto text-center flex flex-col gap-4 px-4 md:px-8 py-16'>
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
                    <Link to='/signup' className='hover:text-red-500'> Sign Up </Link>
                    <Link to='/forgot-password' className='hover:text-red-500'> Forgot Password? </Link>
                </div>
            </div>
        </Layout>
    );
};

export default Signin;