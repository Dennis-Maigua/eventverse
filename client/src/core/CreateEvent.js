import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import Layout from './Layout';
import { getCookie, isAuth } from '../utils/helpers';

const CreateEvent = () => {
    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <HeroSection />
            <CreateEventSection />
        </Layout>
    );
}

const HeroSection = () => {
    return (
        <section className='bg-gray-600 text-white py-14'>
            <div className='container mx-auto px-6 text-center'>
                <h1 className='text-3xl font-bold mb-2'>
                    Create Event
                </h1>
            </div>
        </section>
    );
};

const CreateEventSection = () => {
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
                values, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            console.log('CREATE EVENT SUCCESSFUL: ', response);
            toast.success(response.data.message);

            setValues({ ...values, name: '', date: '', price: '', ticketCount: '',
                description: '', buttonText: 'Created' });
                
            navigate('/my-events'); // Redirect to My Events Page
        } 
        
        catch (err) {
            console.log('ERROR CREATING EVENT: ', err);
            setValues({ ...values, buttonText: 'Create' });
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <section>
            <form onSubmit={handleCreate}>
                <input
                    type="text"
                    name="name"
                    value={name}
                    placeholder="Name"
                    onChange={handleChange}
                />
                <input
                    type="datetime-local"
                    name="date"
                    value={date}
                    placeholder="Date"
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="price"
                    value={price}
                    placeholder="Price"
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                />
                <input
                    type="number"
                    name="ticketCount"
                    value={ticketCount}
                    placeholder="Quantity"
                    onChange={handleChange}
                    min="1"
                />
                <textarea
                    rows='5'
                    type='text'
                    name="description"
                    value={description}
                    placeholder="Description"
                    onChange={handleChange}
                />
                <input
                    type='submit'
                    value={buttonText}
                />
            </form>
        </section>
    );
};

export default CreateEvent;
