import React, { useState } from 'react';
import Layout from './Layout';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const CreateEvent = () => {
    return (
        <Layout>
            <ToastContainer />
            <HeroSection />
            <FormSection />
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

const FormSection = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    const [ticketCount, setTicketCount] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        
        try {
            await axios.post('/events', { name, description, date, price, ticketCount });
            alert('Event created successfully');
        }
        catch (error) {
            console.error(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Event Name" value={name} onChange={e => setName(e.target.value)} required />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
            <input type="number" placeholder="Total Tickets" value={ticketCount} onChange={e => setTicketCount(e.target.value)} required />
            <button type="submit">Create Event</button>
        </form>
    );
};

export default CreateEvent;
