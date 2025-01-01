import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import Layout from './Layout';
import { getCookie, isAuth } from '../utils/helpers';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [editEvent, setEditEvent] = useState(null);
    const [values, setValues] = useState({
        id: '',
        name: '',
        date: '',
        description: '',
        buttonText: 'Update'
    });

    const token = getCookie('token');
    const { id, name, date, description, buttonText } = values;

    useEffect(() => {
        loadMyEvents();
    }, []);

    const loadMyEvents = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/events/my`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setEvents(response.data);
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const clickEdit = (event) => {
        const formattedDate = new Date(event.date).toISOString().slice(0, 16);
        setEditEvent(event);
        setValues({
            ...values,
            id: event._id,
            name: event.name,
            date: formattedDate,
            description: event.description
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Updating...' });

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/event/update/${id}`, 
                {name, date, description},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEditEvent(null);
            toast.success(response.data.message);
            window.location.reload();
        } 
        
        catch (err) {
            setValues({ ...values, buttonText: 'Update' });
            toast.error(err.response?.data?.error);
        }
    };

    const handleDelete = async (eventId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this event?');

        if (confirmDelete) {
            try {
                const response = await axios.delete(
                    `${process.env.REACT_APP_SERVER_URL}/event/delete/${eventId}`, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
   
                toast.success(response.data.message);
                window.location.reload();
            }

            catch (err) {
                toast.error(err.response?.data?.error);
            }
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <div className='bg-gray-500 text-white py-16'>
                <div className='container mx-auto px-4 md:px-8 text-center'>
                    <h1 className='text-3xl font-bold'>
                        My Events
                    </h1>
                </div>
            </div>
            
            {events.length === 0 ? (
                <h1 className='text-xl text-center px-4 md:px-8 py-16'>
                    No events created yet.
                </h1>
            ) : (
                <div className='max-w-md md:min-w-full mx-auto bg-white rounded-lg shadow px-4 md:px-8 py-16'>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-200'>
                            <thead className='bg-gray-50 text-left text-xs text-gray-400 uppercase tracking-wider'>
                                <tr>
                                    <th className='p-3'> Name </th>
                                    <th className='p-3'> Date & Time </th>
                                    <th className='p-3'> Location </th>
                                    <th className='p-3'> Description </th>
                                    {/* <th className='p-3'> Tickets Sold </th>
                                    <th className='p-3'> Revenue </th> */}
                                    <th className='p-3'> Actions </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200 text-sm whitespace-nowrap'>
                                {events.map(event => (
                                    <tr key={event._id}>
                                        <td className='p-3'>{event.name}</td>
                                        <td className='p-3'>{new Date(event.date).toISOString().slice(0, 16)}</td>
                                        <td className='p-3'>{event.location}</td>
                                        <td className='p-3'>{event.description}</td>
                                        {/* <td className='p-3'>{event.ticketCount - event.ticketRemaining} / {event.ticketCount}</td>
                                        <td className='p-3'>${event.price * (event.ticketCount - event.ticketRemaining)}</td> */}
                                        <td className='p-3 font-medium'>
                                            <button className='text-blue-500 hover:opacity-80' onClick={() => clickEdit(event)}> Edit </button>
                                            <button className='text-red-500 hover:opacity-80 ml-3' onClick={() => handleDelete(event._id)}> Delete </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {editEvent && (
                        <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
                            <div className='fixed inset-0 bg-black opacity-50'></div>
                            <div className='bg-slate-100 rounded-lg shadow-lg p-10 z-10 max-w-2xl w-full'>
                                <div className='text-center mb-10'>
                                    <h1 className='text-3xl font-semibold mb-6'> Event </h1>
                                    <span className='font-semibold'> ID: </span>
                                    <span className=''> {id} </span>
                                </div>

                                <form onSubmit={handleUpdate} className='flex flex-col gap-4'>
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

                                    <textarea
                                        rows='4'
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

                                    <button type='button' onClick={() => setEditEvent(null)}
                                        className='font-semibold hover:text-red-500'> Cancel </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default MyEvents;