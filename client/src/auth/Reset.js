import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '../core/Layout';
import { isAuth } from '../utils/helpers';

const Reset = () => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        newPassword: '',
        confirmPassword: '',
        buttonText: 'Continue'
    });

    const { token } = useParams();
    const [reset, setReset] = useState(false);

    useEffect(() => {
        if (token) {
            try {
                const { name } = jwtDecode(token);
                setValues(values => ({ ...values, name, token }));
            }
            
            catch (err) {
                toast.error(err.response?.data?.error);
            }
        }
    }, [token]);

    const { newPassword, confirmPassword, buttonText } = values;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const clickSubmit = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Resetting...' });

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/password/reset`,
                { newPassword, confirmPassword, resetPasswordLink: token }
            );

            setReset(true);
            toast.success(response.data.message);
        }

        catch (err) {
            setValues({ ...values, buttonText: 'Continue' });
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {isAuth() ? <Navigate to='/' /> : null}
            <div className="bg-gray-500 text-white py-12">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <h1 className="text-3xl font-bold">
                        Reset Password
                    </h1>
                </div>
            </div>

            {!reset && (
                <div className='max-w-lg m-auto text-center px-4 md:px-8 py-12'>
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
                            className='py-2 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                        />
                    </form>
                </div>
            )}

            {reset && (
                <div className='max-w-lg m-auto flex items-center text-center px-4 md:px-8 py-12'>
                    <h1 className='text-xl'>
                        Success! You can now sign in using your new password.
                    </h1>
                </div>
            )}
        </Layout>
    );
};

export default Reset;