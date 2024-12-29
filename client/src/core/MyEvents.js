import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import Layout from './Layout';
import { getCookie, isAuth } from '../utils/helpers';

const MyEvents = () => {
    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <HeroSection />
            <MyEventsSection />
        </Layout>
    );
};

const HeroSection = () => {
    return (
        <section className='bg-gray-600 text-white py-14'>
            <div className='container mx-auto px-6 text-center'>
                <h1 className='text-3xl font-bold mb-2'>
                    My Events
                </h1>
            </div>
        </section>
    );
};

const MyEventsSection = () => {
    const [events, setEvents] = useState([]);
    const [editEvent, setEditEvent] = useState(null);
    const [values, setValues] = useState({
        id: '',
        name: '',
        date: '',
        price: '',
        ticketCount: '',
        description: '',
        buttonText: 'Update'
    });

    const token = getCookie('token');
    const { id, name, date, price, ticketCount, description, buttonText } = values;

    useEffect(() => {
        loadMyEvents();
    }, []);

    const loadMyEvents = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/events/my`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            console.log('LOAD MY EVENTS SUCCESSFUL: ', response);
            setEvents(response.data);
        }

        catch (err) {
            console.log('ERROR LOADING MY EVENTS: ', err);
            toast.error(err.response?.data?.error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const clickEdit = (event) => {
        setEditEvent(event);
        setValues({
            ...values,
            id: event._id,
            name: event.name,
            date: event.date,
            price: event.price,
            ticketCount: event.ticketCount,
            description: event.description
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Updating...' });

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/events/${id}`, 
                values,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEditEvent(null);
            console.log('EVENT UPDATE SUCCESSFUL: ', response);
            toast.success(response.data.message);
            window.location.reload();
        } 
        
        catch (err) {
            setValues({ ...values, buttonText: 'Update' });
            console.log('ERROR UPDATING EVENT: ', err);
            toast.error(err.response?.data?.error);
        }
    };

    const handleDelete = async (eventId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this event?');

        if (confirmDelete) {
            try {
                const response = await axios.delete(
                    `${process.env.REACT_APP_API}/event/delete/${eventId}`, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
   
                console.log('DELETE EVENT SUCCESSFUL: ', response);
                toast.success(response.data.message);
                window.location.reload();
            }

            catch (err) {
                console.log('ERROR DELETING EVENT: ', err);
                toast.error(err.response?.data?.error);
            }
        }
    };
  
    return (
        <section>
            {events.length === 0 ? (
                <p>No events created yet.</p>
            ) : (
                <ul>
                    {events.map(event => (
                        <li key={event._id}>
                            <h2>{event.name}</h2>
                            <p>{event.description}</p>
                            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                            <p>Tickets Sold: {event.ticketCount - event.ticketRemaining} / {event.ticketCount}</p>
                            <button className='text-blue-500 hover:opacity-80' onClick={() => clickEdit(event)}> Edit </button>
                            <button className='text-red-500 hover:opacity-80 ml-3' onClick={() => handleDelete(event._id)}> Delete </button>
                        </li>
                    ))}
                </ul>
            )}

            {editEvent && (
                <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
                    <div className='fixed inset-0 bg-black opacity-50'></div>
                    <div className='bg-white rounded-lg shadow-lg p-10 z-10 max-w-2xl w-full'>
                        <div className='text-center mb-10'>
                            <h1 className='text-3xl font-semibold mb-6'> Edit Event </h1>
                            <span className='font-semibold'> ID: </span>
                            <span className=''> {id} </span>
                        </div>

                        <form onSubmit={handleUpdate} className='flex flex-col gap-4'>
                            <div className='grid grid-cols-2 gap-4'>
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
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
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
                            </div>

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

                            <button type='button' onClick={() => setEditEvent(null)}> Cancel </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MyEvents;