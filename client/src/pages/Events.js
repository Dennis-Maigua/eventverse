import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';

import Layout from '../core/Layout';

const Events = () => {
    return (
        <Layout>
            <ToastContainer />
            <HeroSection />
            <EventsSection />
        </Layout>
    );
};

const HeroSection = () => {
    return (
        <section className='bg-gray-600 text-white py-14'>
            <div className='container mx-auto px-6 text-center'>
                <h1 className='text-3xl font-bold mb-2'>
                    All Events
                </h1>
            </div>
        </section>
    );
};

const EventsSection = () => {
    const [events, setEvents] = useState([]);
  
    useEffect(() => {
        fetchAllEvents();     
    }, []);

    const fetchAllEvents = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/events/all`
            );

            console.log('FETCH ALL EVENTS SUCCESSFUL: ', response);
            setEvents(response.data);
        }

        catch (err) {
            console.log('ERROR FETCHING ALL EVENTS: ', err);
        }
    };

    return (
        <section>
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
        </section>
    );
};

export default Events;