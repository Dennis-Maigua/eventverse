import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import Web3 from 'web3';
import EventContract from "../build/contracts/EventContract.json";

import Layout from '../components/Layout';
import { getCookie, isAuth } from '../utils/AuthHelpers';

const EventDetails = () => {
    const [event, setEvent] = useState({});
    const [quantities, setQuantities] = useState({});
    const [account, setAccount] = useState(null);
    const [eventId, setEventId] = useState(null);
    const [buttonText, setButtonText] = useState('Checkout');
    
    const { id } = useParams();
    const navigate = useNavigate();
    
    const token = getCookie('token');

    const web3 = new Web3(window.ethereum);
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const contract = new web3.eth.Contract(EventContract.abi, contractAddress);

    useEffect(() => {
        loadDetails();
        connectWallet();
    }, [id]);

    const loadDetails = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/event/details/${id}`
            );

            setEvent(response.data);
            setEventId(parseInt(response.data.eventId));

            // Initialize ticket quantities with 0 for all tiers
            const initialQuantities = {};
            response.data.tiers.forEach(tier => {
                initialQuantities[tier._id] = 0;
            });

            setQuantities(initialQuantities);
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    const handleChange = (tierId, quantity) => {
        setQuantities(prev => ({
            ...prev, 
            [tierId]: Math.max(0, quantity) // Ensure quantity is non-negative
        }));
    };

    const totalPrice = useMemo(() => {
        if (!event.tiers) return 0;
        
        const total = event.tiers.reduce((total, tier) => {
            const quantity = quantities[tier._id] || 0;
            return total + quantity * tier.price;
        }, 0);

        return parseFloat(total.toFixed(6)); // Round to 6 decimal places and ensure it's a number
    }, [event.tiers, quantities]);
    
    const connectWallet = async () => {
        if (web3) {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
            } 
            catch (err) {
                console.error("MetaMask connection failed: ", err);
            }
        } 
        else {
            toast.error("Please install MetaMask!");
        }
    };

    const handlePurchase = async () => {
        setButtonText('Processing...');
        
        // Redirect to sign-in if the user is not authenticated
        if (!isAuth()) {
            setButtonText('Checkout');
            toast.error("Please sign in first!");
            return;
        }
        
        if (!account) {
            setButtonText('Checkout');
            toast.error("Please connect MetaMask!");
            return;
        }

        const selectedTickets = Object.entries(quantities)
            .filter(([_, quantity]) => quantity > 0)
            .map(([tierId, quantity]) => ({ tierId, quantity }));

        if (selectedTickets.length === 0) {
            setButtonText('Checkout');
            return toast.error('Please select and add a ticket!');
        }

        try {
            // Calculate total cost for all the selected ticket tiers
            const { tierId, quantity } = selectedTickets[0];
            const tierIndex = event.tiers.findIndex(tier => tier._id === tierId);
            const tier = event.tiers[tierIndex];
            const totalCost = web3.utils.toWei((tier.price * quantity).toString(), 'ether');

            if (!tier) console.error('Tier not found!');

            console.log("Tier Index:", tierIndex);
            console.log("Quantity:", quantity);

            // Call the buyTickets function
            await contract.methods.buyTickets(eventId, tierIndex, quantity).send({
                from: account,
                value: totalCost
            });

            await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/tickets/buy`,
                { eventId: event._id, tickets: selectedTickets },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
                // Update the UI after successful purchase
                setEvent(prev => ({
                    ...prev,
                    tiers: prev.tiers.map((tier, idx) =>
                        idx === tierIndex
                            ? { ...tier, ticketRemaining: tier.ticketRemaining - quantity }
                            : tier
                    ),
                }));

                toast.success(response.data.message);
                navigate('/my-tickets');
            })
            .catch((err) => {
                setButtonText('Checkout');
                toast.error(err.response?.data?.error);
            });
        }

        catch (err) {
            setButtonText('Checkout');
            console.error('Transaction failed: ', err);

            if (err.message.includes("revert")) {
                toast.error("Transaction reverted. Check input data or contract logic.");
            } 
            else if (err.code === -32603) {
                toast.error("Internal JSON-RPC error. Check contract deployment and network.");
            } 
            else {
                toast.error("Unexpected error occurred.");
            }
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
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                            })}
                        </p>
                    </div>

                    <h2 className="text-lg font-semibold mt-12">Get your tickets:</h2>
                    <div className="flex flex-col my-4">
                        {event.tiers && event.tiers.length > 0 ? (
                            event.tiers.map(tier => (
                                <div key={tier._id} className="grid grid-cols-4 border-b py-2">
                                    <p className="">{tier.name}</p>
                                    <p className="text-red-500 font-semibold">{tier.price} ETH</p>
                                    <p className="text-sm text-slate-400">(Rem: {tier.ticketRemaining})</p>

                                    <div>
                                        <button
                                            className="px-2 bg-slate-200 rounded-l"
                                            onClick={() => handleChange(tier._id, quantities[tier._id] - 1)}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={quantities[tier._id]}
                                            onChange={(e) => handleChange(tier._id, parseInt(e.target.value) || 0)}
                                            className="w-12 text-center border"
                                        />
                                        <button
                                            className="px-2 bg-slate-200 rounded-r"
                                            onClick={() => handleChange(tier._id, quantities[tier._id] + 1)}
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

                    <div className="flex flex-col gap-2 mt-8">
                        <p className="font-semibold text-lg text-right">
                            Total: {totalPrice} ETH
                        </p>                        
                    
                        {!account ? (
                            <button
                            onClick={connectWallet}
                            className="py-2 bg-blue-500 text-white font-semibold shadow rounded hover:opacity-80"
                            >
                            Connect MetaMask
                            </button>
                        ) : (
                            <div>
                                <p className="text-center text-slate-400">
                                    My Account: <span className="text-green-500 mt-4">{account}</span>
                                </p>
                            </div>
                        )}

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