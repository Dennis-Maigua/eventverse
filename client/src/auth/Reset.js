import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../core/Layout';
import { isAuth } from '../utils/helpers';

const Reset = () => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        newPassword: '',
        confirmPassword: '',
        buttonText: 'Reset Now'
    });

    const { token } = useParams();
    const [reset, setReset] = useState(false);

    useEffect(() => {
        if (token) {
            const { name } = jwtDecode(token);
            setValues(values => ({ ...values, name, token }));
        }
    }, [token]);

    const { name, newPassword, confirmPassword, buttonText } = values;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const clickSubmit = async (event) => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Resetting...' });

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/reset-password`,
                { newPassword, confirmPassword, resetPasswordLink: token }
            );

            console.log('RESET PASSWORD SUCCESS:', response);
            setValues({ ...values, newPassword: '', confirmPassword: '', buttonText: 'Reset Done' });
            toast.success(response.data.message);

            setReset(true);
        }

        catch (err) {
            console.log('RESET PASSWORD FAILED:', err);
            setValues({ ...values, buttonText: 'Reset Now' });
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
                        Reset Password
                    </h1>
                </div>
            </div>

            {!reset && (
                <div className='max-w-lg m-auto text-center px-4 py-14'>
                    <form onSubmit={clickSubmit} className='p-10 flex flex-col shadow rounded gap-4 bg-slate-100'>
                        <input
                            type='password'
                            name='newPassword'
                            value={newPassword}
                            placeholder='New Password'
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                        <input
                            type='password'
                            name='confirmPassword'
                            value={confirmPassword}
                            placeholder='Confirm Password'
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                        <input
                            type='submit'
                            value={buttonText}
                            className='py-3 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                        />
                    </form>
                </div>
            )}

            {reset && (
                <div className='max-w-lg m-auto flex items-center text-center px-4 py-14'>
                    <h1 className='text-2xl'>
                        Success! You can now sign in using your new password.
                    </h1>
                </div>
            )}
        </Layout>
    );
};

export default Reset;