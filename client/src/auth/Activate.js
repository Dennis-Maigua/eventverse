import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../core/Layout';
import { isAuth } from '../utils/helpers';

const Activate = () => {
    const [values, setValues] = useState({
        name: '',
        buttonText: 'Activate Now'
    });

    const { token } = useParams();
    const [activated, setActivated] = useState(false);

    useEffect(() => {
        if (token) {
            const { name } = jwtDecode(token);
            setValues({ ...values, name });
        }
    }, [token]);

    const { name, buttonText } = values;

    const clickSubmit = async (event) => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Activating...' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/activate-account`, { token }
            );

            console.log('ACCOUNT ACTIVATION SUCCESS:', response);
            setValues({ ...values, name: '', buttonText: 'Activated' });
            toast.success(response.data.message);

            setActivated(true);
        }

        catch (err) {
            console.log('ACCOUNT ACTIVATION FAILED:', err);
            setValues({ ...values, buttonText: 'Activate Now' });
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
                        Activate Account
                    </h1>
                </div>
            </div>

            {!activated && (
                <div className='max-w-lg m-auto flex flex-col items-center text-center gap-4 px-4 py-14'>
                    <h1 className='text-2xl'>
                        Hello {name}, you are one step close to completing the process:
                    </h1>
                    <button className='py-2 px-4 w-auto text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded' onClick={clickSubmit}>
                        {buttonText}
                    </button>
                </div>
            )}

            {activated && (
                <div className='max-w-lg m-auto flex items-center text-center px-4 py-14'>
                    <h1 className='text-2xl'>
                        Success! You can now sign in to your new account.
                    </h1>
                </div>
            )}
        </Layout>
    );
};

export default Activate;