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

    const shorten = (content) => {
        return `${content.slice(0, 4)}...${content.slice(-4)}`;
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <div className='bg-gray-500 text-white py-20'>
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
                                    <th className='p-2'> TXN Hash </th>
                                    <th className='p-2'> Account </th>
                                    <th className='p-2'> Event </th>
                                    <th className='p-2'> Venue </th>
                                    <th className='p-2'> Event Date </th>
                                    <th className='p-2'> Purchase Date </th>
                                    <th className='p-2'> Ticket Tiers </th>
                                    <th className='p-2'> Quantity </th>
                                    <th className='p-2'> Total </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200 text-sm whitespace-nowrap'>
                                {tickets.map(ticket => (
                                    <tr key={ticket._id}>
                                    <td className='p-2'>{shorten(ticket.txnHash)}</td>
                                    <td className='p-2'>{shorten(ticket.account)}</td>
                                        <td className='p-2'>
                                            <div className='flex flew-row gap-1 items-center'>
                                                <img
                                                    src={ticket.eventId.posterUrl}
                                                    alt='cover'
                                                    name='posterUrl'
                                                    className='h-10 w-10 self-center border object-cover'
                                                />
                                                {/* {ticket.eventId.name} */}
                                            </div>
                                        </td>
                                        <td className='p-2 truncate'>
                                            {ticket.eventId.venue.map((v, index) => (
                                                <div key={index}>
                                                    {v.name}
                                                </div>
                                            ))}
                                        </td>
                                        <td className='p-2'>
                                            {new Date(ticket.eventId.date).toLocaleString('en-US')}
                                        </td>
                                        <td className='p-2'>
                                            {new Date(ticket.purchaseDate).toLocaleString('en-US')}
                                        </td>
                                        <td className='p-2'>
                                            {ticket.tiers.map((tier, index) => (
                                                <div key={index}>
                                                    {tier.name} @ {tier.price} ETH
                                                </div>
                                            ))}
                                            <br/>
                                        </td>
                                        <td className='p-2'>
                                            {ticket.tiers.map((tier, index) => (
                                                <div key={index}>
                                                    {tier.quantity}
                                                </div>
                                            ))}
                                            <br/>
                                        </td>
                                        <td className='p-2'>
                                            <div>
                                                {ticket.tiers.map((tier, index) => (
                                                    <div key={index}>
                                                        {tier.price * tier.quantity} ETH
                                                    </div>
                                                ))}
                                                <p className='mt-1 border-t text-red-500'>{ticket.totalCost} ETH</p>
                                            </div>
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