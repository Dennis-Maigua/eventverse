import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Web3 from 'web3';
import EventContract from "../build/contracts/EventContract.json";

import Layout from './Layout';
import { getCookie, isAuth } from '../utils/AuthHelpers';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    
    const token = getCookie('token');
    const web3 = new Web3(window.ethereum);

    useEffect(() => {
        loadMyEvents();
    }, []);

    const loadMyEvents = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/events/my`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setEvents(response.data);
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    const shorten = (content) => {
        return `${content.slice(0, 4)}...${content.slice(-4)}`;
    };

    const handleWithdraw = async (eventId, contractAddress) => {
        const confirmWithdrawal = window.confirm('Are you sure you want to withdraw the event revenue?');

        if (!confirmWithdrawal) {
            return;
        }
        
        try {
            const contract = new web3.eth.Contract(EventContract.abi, contractAddress);
            const receipt = await contract.methods.withdrawFunds(eventId, {
                from: contractAddress
            });

            console.log("Contract Address: ", contractAddress);
            console.log("Withdraw event receipt: ", receipt);

            toast.success("Funds withdrawn successfully!");
            window.location.reload();  
        } 
        
        catch (err) {
            console.error('Error withdrawing funds from blockchain: ', err);
            toast.error("Error withdrawing funds from blockchain!");
        }
    };

    const handleCancel = async (id, eventId, contractAddress) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this event?');

        if (!confirmCancel) {
            return;
        }

        try {
            const contract = new web3.eth.Contract(EventContract.abi, contractAddress);

            const receipt = await contract.methods.cancelEvent(eventId, {
                from: contractAddress
            });

            console.log("Contract Address: ", contractAddress);
            console.log("Cancel event receipt: ", receipt);
            console.log("Event canceled successfully!");

            await axios.delete(
                `${process.env.REACT_APP_SERVER_URL}/event/delete/${id}`, 
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
                toast.success(response.data.message);
                window.location.reload();                
            })
            .catch((err) => {
                toast.error(err.response?.data?.error);
            });
        }

        catch (err) {
            console.error('Error cancelling event in blockchain: ', err);
            toast.error("Error cancelling event in blockchain!");
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <div className='bg-gray-500 text-white py-20'>
                <div className='container mx-auto px-4 md:px-8 text-center'>
                    <h1 className='text-3xl font-bold'> My Events </h1>
                </div>
            </div>
            
            {events.length === 0 ? (
                <h1 className='text-xl text-center px-4 md:px-8 py-12'>
                    No events created yet.
                </h1>
            ) : (
                <div className='max-w-3xl md:min-w-full mx-auto bg-white rounded-lg shadow p-4'>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-200'>
                            <thead className='bg-gray-50 text-left text-xs text-gray-400 uppercase tracking-wider'>
                                <tr>
                                    <th className='p-2'> Contract </th>
                                    <th className='p-2'> Account </th>
                                    <th className='p-2'> Event </th>
                                    <th className='p-2'> Ticket(s) </th>
                                    <th className='p-2'> Sold </th>
                                    <th className='p-2'> Revenue </th>
                                    <th className='p-2'> </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200 text-sm whitespace-nowrap'>
                                {events.map(event => (
                                    <tr key={event._id}>
                                        <td className='p-2'>{shorten(event.contractAddress)}</td>
                                        <td className='p-2'>{shorten(event.account)}</td>
                                        <td className='p-2'>
                                            <div className='flex flew-row gap-1 items-center p-2'>
                                                <img
                                                    src={event.posterUrl}
                                                    alt='cover'
                                                    name='posterUrl'
                                                    className='h-10 w-10 self-center border object-cover'
                                                />
                                                {event.name}
                                            </div>
                                        </td>
                                        <td className='p-2'>
                                            {event.tiers.map((tier, i) => (
                                                <div key={i}>
                                                    {tier.name} @ {tier.price} ETH
                                                </div>
                                            ))}
                                        </td>
                                        <td className='p-2'>
                                            {event.tiers.map((tier, i) => (
                                                <div key={i}>
                                                    {(tier.ticketsSold)}/{tier.ticketsCount}
                                                </div>
                                            ))}
                                        </td>
                                        <td className='p-2'>
                                            {event.tiers.map((tier, i) => (
                                                <div key={i}>
                                                    {tier.price * (tier.ticketsSold)} ETH
                                                </div>
                                            ))}
                                        </td>
                                        <td className='p-2 font-medium'>
                                            <button className='text-blue-500 hover:opacity-80' onClick={() => handleWithdraw(event.eventId, event.contractAddress)}> Withdraw </button>
                                            <button className='text-red-500 hover:opacity-80 ml-3' onClick={() => handleCancel(event._id, event.eventId, event.contractAddress)}> Cancel </button>
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

export default MyEvents;