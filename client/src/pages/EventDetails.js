import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import Layout from '../core/Layout';
import { getCookie, isAuth } from '../utils/helpers';

const EventDetails = () => {
    const [event, setEvent] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [buttonText, setButtonText] = useState('Buy Tickets');
    
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
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }
    }

    const handlePurchase = async (e) => {
        e.preventDefault();
        setButtonText('Purchasing...');

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/tickets/buy`, 
                { eventId: id, quantity }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEvent(prev => ({
                ...prev,
                ticketRemaining: prev.ticketRemaining - quantity,
            }));

            toast.success(response.data.message);
            navigate('/my-tickets');
        }

        catch (err) {
            setButtonText('Buy Tickets');
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            <div className='bg-gray-600 text-white py-16'>
                <div className='container mx-auto px-6 text-center'>
                    <h1 className='text-3xl font-bold mb-2'>
                        {event.name}
                    </h1>
                </div>
            </div>
            
            <div>
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
            </div>
        </Layout>
    );
};

export default EventDetails;