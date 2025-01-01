import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import Layout from '../core/Layout';

const Events = () => {
    const [events, setEvents] = useState([]);
  
    useEffect(() => {
        fetchAllEvents();     
    }, []);

    const fetchAllEvents = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/events/all`
            );

            setEvents(response.data);
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            <div className='bg-gray-600 text-white py-16'>
                <div className='container mx-auto px-4 md:px-8 text-center'>
                    <h1 className='text-3xl font-bold'>
                        All Events
                    </h1>
                </div>
            </div>
            
            {events.length === 0 ? (
                <h1 className='text-xl text-center px-4 md:px-8 py-16'>
                    No events created yet.
                </h1>
            ) : (
                <ul>
                    {events.map(event => (
                        <li key={event._id}>
                            <h2>{event.name}</h2>
                            <p>{event.description}</p>
                            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                            <p>Price: {event.price}</p>
                            <p>Tickets Remaining: {event.ticketRemaining}</p>
                            <Link to={`/event/${event._id}`}>
                                View Details
                            </Link>
                        </li>
                    ))}
                </ul>    
            )}
        </Layout>
    );
};

export default Events;