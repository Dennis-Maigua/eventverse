import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import Layout from './Layout';
import { getCookie, isAuth } from '../utils/AuthHelpers';

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [editTicket, setEditTicket] = useState(null);
    const [tiers, setTiers] = useState(null);
    const [values, setValues] = useState({
        txnHash: '',
        account: '',
        posterUrl: '',
        name: '',
        purchaseDate: '',
        totalCost: ''
    });

    const token = getCookie('token');
    const { txnHash, account, posterUrl, name, purchaseDate, totalCost } = values;

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

    const clickView = (ticket) => {
        setEditTicket(ticket);
        setTiers(ticket.tiers);
        setValues({ ...values,
            txnHash: ticket.txnHash,
            account: ticket.account,
            posterUrl: ticket.eventId.posterUrl,
            name: ticket.eventId.name,
            purchaseDate: ticket.purchaseDate,
            totalCost: ticket.totalCost
        });
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
                                    <th className='p-2'> Event Name</th>
                                    <th className='p-2'> Event Date </th>
                                    {/* <th className='p-2'> Venue </th> */}
                                    <th className='p-2'> Purchased On </th>
                                    <th className='p-2'> Ticket(s) </th>
                                    <th className='p-2'> Total (ETH) </th>
                                    <th className='p-2'> </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200 text-sm whitespace-nowrap'>
                                {tickets.map(ticket => (
                                    <tr key={ticket._id}>
                                        <td className='p-2'>{shorten(ticket.txnHash)}</td>
                                        <td className='p-2'>{shorten(ticket.account)}</td>
                                        <td className='px-2'>
                                            <div className='flex flew-row gap-1 items-center'>
                                                <img
                                                    src={ticket.eventId.posterUrl}
                                                    alt='cover'
                                                    name='posterUrl'
                                                    className='h-10 w-10 self-center border object-cover'
                                                />
                                                {ticket.eventId.name}
                                            </div>
                                        </td>
                                        <td className='p-2'>
                                            {new Date(ticket.eventId.date).toLocaleString('en-US')}
                                        </td>
                                        {/* <td className='p-2 truncate'>
                                            {ticket.eventId.venue.map((location, i) => (
                                                <div key={i}>
                                                    {location.name}
                                                </div>
                                            ))}
                                        </td> */}
                                        <td className='p-2'>
                                            {new Date(ticket.purchaseDate).toLocaleString('en-US')}
                                        </td>
                                        <td className='p-2'>
                                            {ticket.tiers.map((tier, index) => (
                                                <div key={index}>
                                                    {tier.quantity} {tier.name} @ {tier.price} ETH
                                                </div>
                                            ))}
                                        </td>
                                        <td className='p-2'>{ticket.totalCost}</td>
                                        <td className='p-2 font-medium'>
                                            <button className='text-blue-500 hover:opacity-80' onClick={() => clickView(ticket)}> View </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {editTicket && (
                        <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
                            <div className='fixed inset-0 bg-black opacity-50' onClick={() => setEditTicket(null)} />
                            <div className='max-w-xl m-auto bg-slate-100 rounded-lg border shadow-lg p-10 z-10'>
                                <div className='flex flex-col gap-2 items-center text-center'>
                                    <img 
                                        src={posterUrl} 
                                        alt={name} 
                                        className="h-40 w-40 object-cover rounded-lg" 
                                    />                                    
                                    <p className="text-sm mt-4">Transaction Hash:</p>
                                    <p className="text-sm text-red-500 truncate">{txnHash}</p>
                                    <p className="text-sm">Account:</p>
                                    <p className="text-sm text-gray-600 truncate">{account}</p>
                                    <p className="text-sm">Purchased On:</p>
                                    <p className="text-sm text-slate-400">
                                        {new Date(purchaseDate).toLocaleString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                        })}
                                    </p>
                                    <p className="text-sm mt-4">Ticket(s) Receipt:</p>
                                    <p className="text-sm font-semibold">
                                        {tiers?.map((tier, index) => (
                                            <div key={index}>
                                                {tier.quantity} {tier.name} @ {tier.price} ETH = {tier.price * tier.quantity} ETH
                                            </div>
                                        ))}
                                    </p>    
                                    <p className='text-red-500 font-semibold'>Total = {totalCost} ETH</p>              
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default MyTickets;