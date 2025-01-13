import React, { useEffect, useState } from 'react';
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
    const [values, setValues] = useState({
        eventId: '',
        contractAddress: null,
        account: null,
        buttonText: 'Checkout'
    });
    
    const { id } = useParams();
    const navigate = useNavigate();
    
    const token = getCookie('token');
    const { eventId, contractAddress, account, buttonText } = values;

    const web3 = new Web3(window.ethereum);

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

            const {eventId, contractAddress} = response.data;

            setValues({ ...values, 
                eventId: eventId,
                contractAddress: contractAddress
             });

            console.log("Event ID from contract:", eventId);
            console.log("Deployed contract address:", contractAddress);

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
        setQuantities(prev => ({ ...prev, 
            [tierId]: Math.max(0, quantity) // Ensure quantity is non-negative
        }));
    };
    
    const connectWallet = async () => {
        if (web3) {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const accounts = await web3.eth.getAccounts();

                setValues({ ...values, account: accounts[0] });
            } 
            catch (err) {
                console.error("MetaMask connection failed: ", err);
            }
        } 
        else {
            toast.error("Please install MetaMask!");
        }
    };

    const shorten = (content) => {
        return `${content.slice(0, 4)}...${content.slice(-4)}`;
    };

    const calculateTotalCost = () => {
        if (!event.tiers) return 0;
    
        return Object.entries(quantities).reduce((total, [tierId, quantity]) => {
            const tier = event.tiers.find(t => t._id === tierId);
            if (tier) {
                return total + tier.price * quantity;
            }
            return total;
        }, 0);
    };

    const handlePurchase = async () => {
        setValues({ ...values, buttonText: 'Processing...' });
        
        if (!isAuth()) {
            toast.error("Please sign in first!");
            setValues({ ...values, buttonText: 'Checkout' });
            return;
        }
        
        if (!account) {
            toast.error("Please connect MetaMask first!");
            setValues({ ...values, buttonText: 'Checkout' });
            return;
        }

        const selectedTickets = Object.entries(quantities)
            .filter(([_, quantity]) => quantity > 0);

        if (selectedTickets.length === 0) {
            toast.error('Please select and add a ticket!');
            setValues({ ...values, buttonText: 'Checkout' });
            return;
        }

        try {
            // Map tierId to tierIndex
            const tierIndexes = selectedTickets.map(([tierId]) => {
                const tierIndex = event.tiers.findIndex(tier => tier._id === tierId);
                if (tierIndex === -1) {
                    toast.error(`Invalid tierId: ${tierId}`);
                }
                return tierIndex;
            });

            const addedQuantities = selectedTickets.map(([_, quantity]) => quantity);
            const totalPrice = calculateTotalCost();
            const contract = new web3.eth.Contract(EventContract.abi, contractAddress);

            // Call the buyTickets function
            const receipt = await contract.methods.buyTickets(
                eventId,
                tierIndexes, 
                addedQuantities
            ).send({
                from: account,
                value: web3.utils.toWei(totalPrice.toString(), "ether")
            });

            // Extract transaction details
            const txnHash = receipt.transactionHash;
            
            console.log("Ticket(s) bought via blockchain successfully!");

            const mappedTickets = Object.entries(quantities)
                .filter(([_, quantity]) => quantity > 0)
                .map(([tierId, quantity]) => ({ tierId, quantity }));

            await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/tickets/buy`, { 
                    eventId: id,
                    txnHash,
                    account,
                    tickets: mappedTickets, 
                    totalCost: totalPrice 
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
                toast.success(response.data.message);
                navigate('/my-tickets');
            })
            .catch((err) => {
                toast.error(err.response?.data?.error);
                setValues({ ...values, buttonText: 'Checkout' });
            });
        }

        catch (err) {
            setValues({ ...values, buttonText: 'Checkout' });
            console.error('Error buying tickets: ', err);
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
                                    <p className="text-sm text-slate-400">(Rem: {tier.ticketsCount - tier.ticketsSold})</p>

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
                            Total: {calculateTotalCost()} ETH
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
                                    My Account: <span className="text-green-500 mt-4">{shorten(account)}</span>
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