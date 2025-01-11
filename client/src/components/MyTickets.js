import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import Layout from './Layout';
import { getCookie, isAuth } from '../utils/AuthHelpers';

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const token = getCookie('token');

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/tickets/my`, 
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

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <div className='bg-gray-500 text-white py-12'>
                <div className='container mx-auto px-6 text-center'>
                    <h1 className='text-3xl font-bold'>
                        My Tickets
                    </h1>
                </div>
            </div>
            
            {tickets.length === 0 ? (
                <h1 className='text-xl text-center px-4 md:px-8 py-12'>
                    No tickets purchased yet.
                </h1>
            ) : (
                <div className='max-w-3xl md:min-w-full mx-auto bg-white rounded-lg shadow p-4'>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-200'>
                            <thead className='bg-gray-50 text-left text-xs text-gray-400 uppercase tracking-wider'>
                                <tr>
                                    <th className='p-2'> Event </th>
                                    <th className='p-2'> Date </th>
                                    <th className='p-2'> Time </th>
                                    <th className='p-2'> Venue </th>
                                    <th className='p-2'> Tier </th>
                                    <th className='p-2'> Quantity </th>
                                    <th className='p-2'> Total </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200 text-sm whitespace-nowrap'>
                                {tickets.map(ticket => (
                                    <tr key={ticket._id}>
                                        <td className='p-2 truncate'>{ticket.eventId.name}</td>
                                        <td className='p-2'>
                                            {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(ticket.eventId.date))}
                                        </td>
                                        <td className='p-2'>
                                            {new Date(ticket.eventId.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className='p-2 truncate'>
                                            {ticket.eventId.venue.map((v, index) => (
                                                <div key={index}>
                                                    {v.name}
                                                </div>
                                            ))}
                                        </td>
                                        <td className='p-2'>
                                            {ticket.tiers.map((tier, index) => (
                                                <div key={index}>
                                                    {tier.name} @ ${tier.price}
                                                </div>
                                            ))}
                                        </td>
                                        <td className='p-2'>
                                            {ticket.tiers.map((tier, index) => (
                                                <div key={index}>
                                                    {tier.quantity}
                                                </div>
                                            ))}
                                        </td>
                                        <td className='p-2'>
                                            {ticket.tiers.map((tier, index) => (
                                                <div key={index}>
                                                    ${tier.price * tier.quantity}
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default MyTickets;