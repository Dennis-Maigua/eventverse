import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import Layout from '../core/Layout';
import { getCookie, isAuth } from '../utils/helpers';

const EventDetails = () => {
    return (
        <Layout>
            <ToastContainer />
            <HeroSection />
            <EventDetailsSection />
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

const EventDetailsSection = () => {
    const [event, setEvent] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [buttonText, setButtonText] = useState('Buy Tickets');
    
    const { id } = useParams();
    const navigate = useNavigate();
    const token = getCookie('token');

    useEffect(() => {
        loadDetails();
    }, []);

    const loadDetails = async () => {
        try {
            const response = axios.get(
                `${process.env.REACT_APP_API}/event/details/${id}`
            );

            console.log('LOAD EVENT DETAILS SUCCESSFUL: ', response);
            setEvent(response.data);
        }

        catch (err) {
            console.log('ERROR LOADING EVENT DETAILS: ', err);
            toast.error(err.response?.data?.error);
        }
    }

    const handlePurchase = async (e) => {
        e.preventDefault();
        setButtonText('Purchasing...');

        try {
            const response = await axios.post(`${process.env.REACT_APP_API}/tickets/buy`, 
                { eventId: id, quantity }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('TICKETS PURCHASE SUCCESSFUL:', response);
            toast.success(response.data.message);

            setEvent(prev => ({
                ...prev,
                ticketRemaining: prev.ticketRemaining - quantity,
            }));

            navigate('/my-tickets'); // Redirect to My Tickets Page
        }

        catch (err) {
            console.log('ERROR PURCHASING TICKETS:', err);
            setButtonText('Buy Tickets');
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <section>
            <h1>{event.name}</h1>
            <p>{event.description}</p>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Price: {event.price}</p>
            <p>Tickets Remaining: {event.ticketRemaining}</p>
            <div>
                <input
                    type="number"
                    min="1"
                    max={event.ticketRemaining}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />

                {!isAuth() ? (
                    <Link to="/signin"> {buttonText} </Link>
                ) : (
                    <button onClick={handlePurchase}> {buttonText} </button>
                )}
            </div>            
        </section>
    );
};

export default EventDetails;