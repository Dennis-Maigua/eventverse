import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import Layout from '../core/Layout';
import { getCookie } from '../utils/helpers';

const EventDetails = () => {
    const [event, setEvent] = useState({});
    const [ticketQuantities, setTicketQuantities] = useState({});
    const [buttonText, setButtonText] = useState('Buy Now');
    
    const { id } = useParams();
    const navigate = useNavigate();
    const token = getCookie('token');

    useEffect(() => {
        loadDetails();
    }, [id]);

    const loadDetails = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/event/details/${id}`
            );

            setEvent(response.data);

            // Initialize ticket quantities with 0 for all tiers
            const initialQuantities = {};
            response.data.tiers.forEach(tier => {
                initialQuantities[tier._id] = 0;
            });

            setTicketQuantities(initialQuantities);
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    const handleQuantityChange = (tierId, quantity) => {
        setTicketQuantities(prev => ({
            ...prev,
            [tierId]: Math.max(0, quantity) // Ensure quantity is non-negative
        }));
    };

    const handlePurchase = async () => {
        setButtonText('Buying...');

        const selectedTickets = Object.entries(ticketQuantities)
            .filter(([_, quantity]) => quantity > 0)
            .map(([tierId, quantity]) => ({ tierId, quantity }));

        if (selectedTickets.length === 0) {
            setButtonText('Buy Now');
            return toast.error('Select at least one ticket to buy!');
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/tickets/buy`,
                { eventId: event._id, tickets: selectedTickets },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update ticketRemaining for each tier
            setEvent(prev => ({
                ...prev,
                tiers: prev.tiers.map(tier => {
                    const selectedTier = selectedTickets.find(ticket => ticket.tierId === tier._id);
                    if (selectedTier) {
                        return {
                            ...tier,
                            ticketRemaining: tier.ticketRemaining - selectedTier.quantity,
                        };
                    }
                    return tier;
                })
            }));

            toast.success(response.data.message);
            navigate('/my-tickets');
        }

        catch (err) {
            setButtonText('Buy Now');
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            <div className="flex flex-wrap py-12 px-4 md:px-8">
                <div className="w-full md:w-1/2 px-8 lg:px-16 mb-8 lg:mb-0">
                    <img 
                        src={event.posterUrl} 
                        alt={event.name} 
                        className="w-full object-cover rounded-lg" 
                    />
                </div>

                <div className="w-full md:w-1/2 p-4 md:p-8 border shadow-lg rounded-lg">
                    <div className='flex flex-col gap-3'>
                        <h1 className="text-2xl font-semibold">{event.name}</h1>
                        <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleString('en-US', {
                                weekday: 'long', // Options: 'narrow', 'short', 'long'
                                year: 'numeric',
                                month: 'long', // Options: 'narrow', 'short', 'long'
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true, // Use 12-hour format
                            })}
                        </p>
                        <p className="text-sm italic text-slate-400 font-semibold">{event.category}</p>
                        <p className="">{event.description}</p>
                    </div>

                    <h2 className="text-lg font-semibold mt-12">Get your tickets:</h2>
                    <div className="flex flex-col my-4">
                        {event.tiers && event.tiers.length > 0 ? (
                            event.tiers.map(tier => (
                                <div key={tier._id} className="grid grid-cols-4 border-b py-2">
                                    <p className="">{tier.name}</p>
                                    <p className="text-red-500 font-semibold">${tier.price}</p>
                                    <p className="text-sm text-slate-400">(Rem: {tier.ticketRemaining})</p>

                                    <div>
                                        <button
                                            className="px-2 bg-slate-200 rounded-l"
                                            onClick={() => handleQuantityChange(tier._id, ticketQuantities[tier._id] - 1)}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={ticketQuantities[tier._id]}
                                            onChange={(e) => handleQuantityChange(tier._id, parseInt(e.target.value) || 0)}
                                            className="w-12 text-center border"
                                        />
                                        <button
                                            className="px-2 bg-slate-200 rounded-r"
                                            onClick={() => handleQuantityChange(tier._id, ticketQuantities[tier._id] + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h2 className='text-xl text-center px-4 md:px-8 py-12'>
                                No ticket tiers available.
                            </h2>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 mt-8">
                        <p className="font-semibold text-lg text-right">
                            Total: $
                            {event.tiers
                                ? event.tiers.reduce((total, tier) => {
                                    const quantity = ticketQuantities[tier._id] || 0;
                                    return total + quantity * tier.price;
                                }, 0)
                                : 0}
                        </p>
                        <button
                            className="px-4 py-2 right-0 text-white font-semibold bg-red-500 rounded shadow hover:opacity-80"
                            onClick={handlePurchase}
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EventDetails;