import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '../components/Layout';
import { isAuth } from '../utils/AuthHelpers';

const Activate = () => {
    const [values, setValues] = useState({
        name: '',
        buttonText: 'Continue'
    });

    const { token } = useParams();
    const [activated, setActivated] = useState(false);

    useEffect(() => {
        if (token) {
            const { username } = jwtDecode(token);
            setValues({ ...values, name: username });
        }
    }, [token]);

    const { name, buttonText } = values;

    const clickSubmit = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Activating...' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/account/activate`, 
                { token }
            );

            setActivated(true);
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
            <div className="bg-gray-500 text-white py-20">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <h1 className="text-3xl font-bold">
                        Activate Account
                    </h1>
                </div>
            </div>

            {!activated && (
                <div className='max-w-lg m-auto flex flex-col items-center text-center gap-4 px-4 md:px-8 py-12'>
                    <h1 className='text-xl'>
                        Hello {name}, you are one step close to completing the process:
                    </h1>
                    <button className='py-2 px-4 w-auto text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded' onClick={clickSubmit}>
                        {buttonText}
                    </button>
                </div>
            )}

            {activated && (
                <div className='max-w-lg m-auto flex items-center text-center px-4 md:px-8 py-12'>
                    <h1 className='text-xl'>
                        Success! You can now sign in to your new account.
                    </h1>
                </div>
            )}
        </Layout>
    );
};

export default Activate;