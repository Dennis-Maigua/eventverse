import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import Layout from './Layout';
import { getCookie, isAuth } from '../utils/helpers';

const MyTickets = () => {
    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <HeroSection />
            <MyTicketsSection />
        </Layout>
    );
};

const HeroSection = () => {
    return (
        <section className='bg-gray-600 text-white py-14'>
            <div className='container mx-auto px-6 text-center'>
                <h1 className='text-3xl font-bold mb-2'>
                    My Tickets
                </h1>
            </div>
        </section>
    );
};

const MyTicketsSection = () => {
    const [tickets, setTickets] = useState([]);
    const [transferTickets, setTransferTickets] = useState(null);
    const [values, setValues] = useState({ 
        eventId: '', 
        quantity: 0, 
        recipient: '',
        buttonText: 'Send'
    });

    const token = getCookie('token');
    const { eventId, quantity, recipient, buttonText } = values;

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/tickets/my`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('LOAD MY TICKETS SUCCESSFUL: ', response);
            setTickets(response.data);
        }

        catch (err) {
            console.log('ERROR LOADING MY TICKETS: ', err);
            toast.error(err.response?.data?.error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const clickTransfer = (ticket) => {
        setTransferTickets(ticket);
        setValues({
            ...values,
            eventId: ticket.eventId,
            quantity: ticket.quantity,
            recipient: ''
        });
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Sending...' });

        const confirmTransfer = window.confirm('Are you sure you want to transfer your tickets?');

        if (confirmTransfer) {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API}/tickets/transfer`, 
                    values, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                setTransferTickets(null);
                console.log('TICKET TRANSFER SUCCESSFUL: ', response);
                toast.success(response.data.message);
                window.location.reload();
            } 
            
            catch (err) {
                setValues({ ...values, buttonText: 'Send' });
                console.log('ERROR TRANSFERRING TICKET: ', err);
                toast.error(err.response?.data?.error);
            }
        }
    };
  
    return (
        <section>
            {tickets.length === 0 ? (
                <p>No tickets purchased yet.</p>
            ) : (
                <ul>
                    {tickets.map(ticket => (
                        <li key={ticket._id}>
                            <h2>{ticket.eventId.name}</h2>
                            <p>Quantity: {ticket.quantity}</p>
                            <p>Purchased On: {new Date(ticket.purchaseDate).toLocaleDateString()}</p>
                            <button className='text-blue-500 hover:opacity-80' onClick={() => clickTransfer(ticket)}> Transfer </button>
                        </li>
                    ))}
                </ul>
            )}

            {transferTickets && (
                <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
                    <div className='fixed inset-0 bg-black opacity-50'></div>
                    <div className='bg-white rounded-lg shadow-lg p-10 z-10 max-w-2xl w-full'>
                        <div className='text-center mb-10'>
                            <h1 className='text-3xl font-semibold mb-6'> Transfer Tickets </h1>
                            <span className='font-semibold'> Event ID: </span>
                            <span className=''> {eventId} </span>
                        </div>

                        <form onSubmit={handleTransfer} className='flex flex-col gap-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Quantity"
                                    value={quantity}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="recipient"
                                    placeholder="Recipient Email"
                                    value={recipient}
                                    onChange={handleChange}
                                />
                            </div>

                            <input
                                type='submit'
                                value={buttonText}
                            />
                            <button type='button' onClick={() => setTransferTickets(null)}> Cancel </button>
                        </form>
                    </div>
                </div>
            )}           
        </section>
    );
};

export default MyTickets;