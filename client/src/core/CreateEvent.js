import React, { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api'

import Layout from './Layout';
import { getCookie, isAuth } from '../utils/helpers';

const CreateEvent = () => {
    const [tiers, setTiers] = useState([{ 
        type: '', 
        price: '' ,
        ticketCount: '',
        ticketRemaining: ''
    }]);
    const [values, setValues] = useState({
        name: '',
        date: '',
        location: '',
        description: '',
        buttonText: 'Create'
    });

    const navigate = useNavigate();
    const inputRef = useRef(null);

    const token = getCookie('token');

    const { name, date, location, description, buttonText } = values;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries:["places"]
    });

    const handleOnPlacesChanged = () => {
        const place = inputRef.current.getPlaces();
        if (place && place.length > 0) {
            const address = place[0].name;
            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();

            setValues({ ...values, location: address });
        }
    };

    const handleAddTier = () => {
        setTiers([...tiers, { type: '', price: '', ticketCount: '', ticketRemaining: '' }]);
    };

    const handleRemoveTier = (index) => {
        const newTiers = tiers.filter((_, i) => i !== index);
        setTiers(newTiers);
    };
  
    const handleTierChange = (index, field, value) => {
        const newTiers = [...tiers];
        newTiers[index][field] = value;
        setTiers(newTiers);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Creating...' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/event/create`, 
                { name, date, location, description, tiers }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success(response.data.message);

            setTiers([{ type: '', price: '', ticketCount: '', ticketRemaining: '' }]);
            setValues({ 
                ...values, 
                name: '', 
                date: '',
                location: '',
                description: '',
                buttonText: 'Created' 
            });
                
            navigate('/my-events');
        } 
        
        catch (err) {
            setValues({ ...values, buttonText: 'Create' });
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <div className="bg-gray-500 text-white py-16">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <h1 className="text-3xl font-bold">
                        Create Event
                    </h1>
                </div>
            </div>
            
            <div className='max-w-2xl m-auto text-center flex flex-col gap-4 px-4 md:px-8 py-16'>
                <form onSubmit={handleCreate} className='p-10 flex flex-col shadow rounded gap-4 bg-slate-100'>
                    <div className='grid grid-cols-2 gap-4'>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            placeholder="Event Name"
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                        <input
                            type="datetime-local"
                            name="date"
                            value={date}
                            placeholder="Event Date"
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
                                placeholder="Event Location"
                                className='w-full p-3 shadow rounded'
                            />
                        </StandaloneSearchBox>
                    )}

                    <textarea
                        rows='3'
                        type='text'
                        name="description"
                        value={description}
                        placeholder="Event Description"
                        onChange={handleChange}
                        className='p-3 shadow rounded'
                    />

                    {tiers.map((tier, index) => (
                        <div key={index} className='flex flex-row gap-4'>
                            <input
                                type="text"
                                placeholder="Ticket Type"
                                value={tier.type}
                                onChange={(e) => handleTierChange(index, 'type', e.target.value)}
                                className='w-1/2 p-3 shadow rounded'
                            />
                            <input
                                type="number"
                                placeholder="Price ($)"
                                value={tier.price}
                                onChange={(e) => handleTierChange(index, 'price', e.target.value)}
                                className='w-1/4 p-3 shadow rounded'
                            />
                            <input
                              type="number"
                              placeholder="Quantity"
                              value={tier.ticketCount}
                              onChange={(e) => handleTierChange(index, 'ticketCount', e.target.value)}
                              className="w-1/4 p-3 shadow rounded"
                              required
                            />

                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveTier(index)}
                                className="w-1/8 text-red-500"
                              >
                                x
                              </button>
                            )}

                            {index === tiers.length - 1 && (
                                <button
                                    type="button"
                                    onClick={handleAddTier}
                                    className="w-1/8 text-blue-500"
                                >
                                    +
                                </button>
                            )}
                        </div>
                    ))}

                    <input
                        type='submit'
                        value={buttonText}
                        className='py-3 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                    />
                </form>
            </div>
        </Layout>
    );
}

export default CreateEvent;
