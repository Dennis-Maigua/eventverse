import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import Web3 from 'web3';
import EventContract from "../build/contracts/EventContract.json";

import Layout from './Layout';
import { getCookie, isAuth } from '../utils/AuthHelpers';

const libraries = ["places"]; 

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [account, setAccount] = useState('');
    const [editEvent, setEditEvent] = useState(null);
    const [values, setValues] = useState({
        id: '',
        posterUrl: '',
        name: '',
        date: '',
        locality: '',
        buttonText: 'Update'
    });
    const [venue, setVenue] = useState([{ 
        name: '', 
        latitude: '' ,
        longitude: ''
    }]);

    const fileRef = useRef(null);
    const inputRef = useRef(null);    
    const [imageError, setImageError] = useState(false);
    const [imagePercent, setImagePercent] = useState(0);
    
    const token = getCookie('token');
    const web3 = new Web3(window.ethereum);
    const { id, posterUrl, name, date, locality, buttonText } = values;

    useEffect(() => {
        loadMyEvents();
        connectWallet();
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

    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries
    });

    const shorten = (content) => {
        return `${content.slice(0, 4)}...${content.slice(-4)}`;
    };
    
    const handleUpload = async (image) => {
        if (image.size > 2 * 1024 * 1024) {
            setImageError(true);
            return;
        }

        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImagePercent(Math.round(progress));
            },
            (error) => {
                setImageError(true);
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setValues({ ...values, posterUrl: downloadURL });
                    setImagePercent(100);
                });
            }
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const clickEdit = (event) => {
        const eventDate = new Date(event.date).toISOString().slice(0, 16);

        setEditEvent(event);
        setValues({
            ...values,
            id: event._id,
            posterUrl: event.posterUrl,
            name: event.name,
            date: eventDate,
            locality: event.venue[0].name
        });
    };

    const handleOnPlacesChanged = () => {
        const place = inputRef.current.getPlaces();
        if (place && place.length > 0) {
            const address = place[0].name;
            const lat = place[0].geometry.location.lat();
            const long = place[0].geometry.location.lng();

            setVenue([{ name: address, latitude: lat, longitude: long }]);
            setValues((prevValues) => ({ ...prevValues, locality: address }));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Updating...' });

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/event/update/${id}`, 
                { ...values, venue },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEditEvent(null);
            toast.success(response.data.message);
            window.location.reload();
        } 
        
        catch (err) {
            setValues({ ...values, buttonText: 'Update' });
            toast.error(err.response?.data?.error);
        }
    };
    
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

    const handleWithdraw = async (eventId, contractAddress) => {
        const confirmWithdrawal = window.confirm('Are you sure you want to withdraw the revenue funds?');

        if (!confirmWithdrawal) {
            return;
        }
        
        try {
            const contract = new web3.eth.Contract(EventContract.abi, contractAddress);
            const receipt = await contract.methods.withdrawFunds(eventId)
                .send({ from: account });

            console.log("Contract Address: ", contractAddress);
            console.log("Withdraw funds receipt: ", receipt);

            toast.success("Revenue funds withdrawn successfully!");
            window.location.reload();  
        } 
        
        catch (err) {
            console.error('Error withdrawing funds from blockchain: ', err);

            const errorMessage = err?.message || "Error withdrawing funds from blockchain!";
            toast.error(errorMessage);
        }
    };

    const handleDelete = async (id, eventId, contractAddress) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this event?');

        if (!confirmDelete) {
            return;
        }

        try {
            const contract = new web3.eth.Contract(EventContract.abi, contractAddress);

            const receipt = await contract.methods.cancelEvent(eventId)
                .send({ from: account });

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

            const errorMessage = err?.message || "Error cancelling event in blockchain!";
            toast.error(errorMessage);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <div className='bg-gray-500 text-white py-20'>
                <div className='container mx-auto px-4 md:px-8 text-center'>
                    <h1 className='text-3xl font-bold'> My Events </h1>
                    
                    {!account ? (
                        <button
                        onClick={connectWallet}
                        className="px-3 py-2 bg-blue-500 text-white font-semibold shadow rounded hover:opacity-80 mt-2"
                        >
                        Connect MetaMask
                        </button>
                    ) : (
                        <div>
                            <p className="text-red-300 mt-4">
                                My Account: <span className="text-blue-300 mt-4">{shorten(account)}</span>
                            </p>
                        </div>
                    )}
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
                                    <th className='p-2'> Event Name </th>
                                    <th className='p-2'> Event Date </th>
                                    <th className='p-2'> Event Venue </th>
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
                                        <td className='p-2'>{new Date(event.date).toLocaleString('en-US')}</td>
                                        <td className='p-2 truncate'>{event.venue[0].name}</td>
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
                                            <div className='flex flex-col'>
                                                <button 
                                                    className='text-blue-500 hover:opacity-80' 
                                                    onClick={() => clickEdit(event)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className='text-slate-400 hover:opacity-80' 
                                                    onClick={() => handleWithdraw(event.eventId, event.contractAddress)}
                                                >
                                                    Withdraw
                                                </button>
                                                <button 
                                                    className='text-red-500 hover:opacity-80 ml-3' 
                                                    onClick={() => handleDelete(event._id, event.eventId, event.contractAddress)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {editEvent && (
                        <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
                            <div className='fixed inset-0 bg-black opacity-50' onClick={() => setEditEvent(null)}/>
                            <div className='max-w-2xl m-auto bg-slate-100 rounded-lg border shadow-lg p-10 z-10'>
                                <div className='flex flex-col items-center text-center mb-8'>
                                    <input
                                        type='file'
                                        ref={fileRef}
                                        accept='image/*'
                                        onChange={(e) => {
                                            const selectedFile = e.target.files[0];
                                            if (selectedFile) {
                                                handleUpload(selectedFile);
                                            }
                                        }}
                                        hidden
                                    />
                                    <img
                                        src={posterUrl}
                                        alt={name}
                                        name='posterUrl'
                                        className='h-40 w-40 self-center border shadow-lg object-cover cursor-pointer'
                                        onClick={() => fileRef.current.click()}
                                    />
                                    <div className='text-sm font-medium'>
                                        {imageError ? (
                                            <span className='text-red-500'>
                                                File size must be less than 2 MB!
                                            </span>
                                        ) : imagePercent > 0 && imagePercent < 100 ? (
                                            <span className='text-blue-500'>
                                                Uploading: {imagePercent} %
                                            </span>
                                        ) : imagePercent === 100 ? (
                                            <span className='text-green-500'>
                                                Image uploaded successfully!
                                            </span>
                                        ) : null}
                                    </div>
                                </div>

                                <form onSubmit={handleUpdate} className='flex flex-col gap-4'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <input
                                            type="text"
                                            name="name"
                                            value={name}
                                            placeholder="Name"
                                            onChange={handleChange}
                                            className='p-3 shadow rounded'
                                        />
                                        <input
                                            type="datetime-local"
                                            name="date"
                                            value={date}
                                            placeholder="Date"
                                            onChange={handleChange}
                                            className='p-3 shadow rounded'
                                        />
                                    </div>
                                    
                                    {isLoaded && (
                                        <StandaloneSearchBox
                                            onLoad={(ref) => inputRef.current = ref}
                                            onPlacesChanged={handleOnPlacesChanged}                       
                                        >
                                            <input
                                                type="text"
                                                name="locality"
                                                value={locality}
                                                placeholder="Venue"
                                                onChange={handleChange}
                                                className='w-full p-3 shadow rounded'
                                            />
                                        </StandaloneSearchBox>
                                    )}

                                    <input
                                        type='submit'
                                        value={buttonText}
                                        className='py-3 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                                    />
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default MyEvents;