import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './Layout';
import { getCookie, isAuth } from '../utils/helpers';

const CreateEvent = () => {
    const [values, setValues] = useState({
        name: '',
        date: '',
        price: '',
        ticketCount: '',
        description: '',
        buttonText: 'Create'
    });

    const navigate = useNavigate();
    const token = getCookie('token');
    const { name, date, price, ticketCount, description, buttonText } = values;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Creating...' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/event/create`, 
                { name, date, price, ticketCount, description }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success(response.data.message);

            setValues({ ...values, name: '', date: '', price: '', ticketCount: '',
                description: '', buttonText: 'Created' });
                
            navigate('/my-events'); // Redirect to My Events Page
        } 
        
        catch (err) {
            setValues({ ...values, buttonText: 'Create' });
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <div className="bg-gray-600 text-white py-12">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        Create Event
                    </h1>
                </div>
            </div>
            
            <div className='max-w-2xl m-auto text-center flex flex-col gap-4 px-4 py-10'>
                <form onSubmit={handleCreate} className='p-10 flex flex-col shadow rounded gap-4 bg-slate-100'>
                    <div className='grid grid-cols-2 gap-4'>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            placeholder="Event Name"
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                        <input
                            type="datetime-local"
                            name="date"
                            value={date}
                            placeholder="Event Date"
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <input
                            type="number"
                            name="price"
                            value={price}
                            placeholder="Ticket Price ($)"
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className='p-3 shadow rounded'
                        />
                        <input
                            type="number"
                            name="ticketCount"
                            value={ticketCount}
                            placeholder="Ticket Count"
                            onChange={handleChange}
                            min="1"
                            className='p-3 shadow rounded'
                        />
                    </div>
                    <textarea
                        rows='5'
                        type='text'
                        name="description"
                        value={description}
                        placeholder="Event Description"
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
        </Layout>
    );
}

export default CreateEvent;
