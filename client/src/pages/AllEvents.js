import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

import Layout from '../components/Layout';

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

    const getLowestPrice = (tiers) => {
        if (tiers && tiers.length > 0) {
            return Math.min(...tiers.map(tier => tier.price));
        }
        return 0; // Default if no tiers are available
    };

    return (
        <Layout>
            <ToastContainer />            
            {events.length === 0 ? (
                <div className='container mx-auto px-4 md:px-8 text-center py-12'>
                    <h1 className='text-xl'>
                        No events created yet.
                    </h1>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-16 px-8 md:px-16 py-8">
                    {events.map(event => (
                        <Link
                            to={`/event/${event._id}`}
                            key={event._id}
                            className="block bg-white border shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
                        >
                            <img
                                src={event.posterUrl}
                                alt={event.name}
                                className="h-60 w-60 object-cover"
                            />
                            <div className="p-4 flex flex-col gap-1">
                                <h2 className="text-lg font-semibold text-gray-600 truncate">{event.name}</h2>
                                <p className="text-sm text-slate-400">
                                    {new Date(event.date).toLocaleString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true,
                                    })}
                                </p>
                                <p className="text-sm italic text-gray-600 truncate">
                                    {event.venue[0].name}
                                </p>
                                <p className="text-red-400 font-semibold">
                                    From {getLowestPrice(event.tiers)} ETH
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>    
            )}
        </Layout>
    );
};

export default Events;