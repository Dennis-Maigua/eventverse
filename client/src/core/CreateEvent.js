import React, { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';

import Layout from './Layout';
import { getCookie, isAuth } from '../utils/helpers';
import Cover from '../assets/cover.jpg';

const libraries = ["places"]; 

const CreateEvent = () => {
    const [values, setValues] = useState({
        posterUrl: '',
        name: '',
        date: '',
        category: '',
        description: '',
        buttonText: 'Submit'
    });
    const [tiers, setTiers] = useState([{ 
        name: '', 
        price: '' ,
        ticketCount: ''
    }]);
    const [venue, setVenue] = useState([{ 
        name: '', 
        latitude: '' ,
        longitude: ''
    }]);

    const navigate = useNavigate();
    const fileRef = useRef(null);
    const inputRef = useRef(null);    
    const [imageError, setImageError] = useState(false);
    const [imagePercent, setImagePercent] = useState(0);

    const token = getCookie('token');
    const { posterUrl, name, date, category, description, buttonText } = values;
    const categories = ["Arts", "Business", "Entertainment", "Socio-Cultural", "Sports", "Technology"];

    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries
    });

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

    const handleOnPlacesChanged = () => {
        const place = inputRef.current.getPlaces();
        if (place && place.length > 0) {
            const address = place[0].name;
            const lat = place[0].geometry.location.lat();
            const long = place[0].geometry.location.lng();

            setVenue([{ name: address, latitude: lat, longitude: long }]);
        }
    };

    const handleAddTier = () => {
        setTiers([...tiers, { type: '', price: '', ticketCount: '' }]);
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
        setValues({ ...values, buttonText: 'Submittting...' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/event/create`, 
                { posterUrl, name, date, category, description, venue, tiers }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success(response.data.message);

            setVenue([{ name: '', latitude: '', longitude: '' }]);
            setTiers([{ name: '', price: '', ticketCount: '' }]);
            setValues({ 
                ...values, 
                posterUrl: '', 
                name: '', 
                date: '', 
                category: '',
                description: '', 
                buttonText: 'Submitted' 
            });
                
            navigate('/my-events');
        } 
        
        catch (err) {
            setValues({ ...values, buttonText: 'Submit' });
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
            
            <div className='max-w-2xl m-auto text-center px-4 md:px-8 py-16'>
                <form onSubmit={handleCreate} className='p-10 flex flex-col border shadow-lg rounded-lg gap-4 bg-slate-100'>
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
                        src={posterUrl || Cover}
                        alt='cover'
                        name='posterUrl'
                        className='h-40 w-40 self-center border shadow-lg object-cover cursor-pointer'
                        onClick={() => fileRef.current.click()}
                    />
                    <div className='text-sm text-center font-medium'>
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

                    <div className='flex flex-row gap-4'>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            placeholder="Event Name"
                            onChange={handleChange}
                            className='w-3/5 p-3 shadow rounded'
                        />
                        <input
                            type="datetime-local"
                            name="date"
                            value={date}
                            placeholder="Event Date"
                            onChange={handleChange}
                            className='w-2/5 p-3 shadow rounded'
                        />
                    </div>

                    <div className='flex flex-row gap-4'>
                        <select
                            name="category"
                            value={category}
                            onChange={handleChange}
                            className='w-3/8 p-3 shadow rounded'
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <input
                            type='text'
                            name="description"
                            value={description}
                            placeholder="Event Description"
                            onChange={handleChange}
                            className='w-full p-3 shadow rounded'
                        />
                    </div>

                    {isLoaded && (
                        <StandaloneSearchBox
                            onLoad={ref => inputRef.current = ref}
                            onPlacesChanged={handleOnPlacesChanged}                       
                        >
                            <input
                                type="text"
                                placeholder="Event Location"
                                className='w-full p-3 shadow rounded'
                            />
                        </StandaloneSearchBox>
                    )}

                    {tiers.map((tier, index) => (
                        <div key={index} className='flex flex-row gap-4'>
                            <input
                                type="text"
                                placeholder="Ticket Name"
                                value={tier.name}
                                onChange={(e) => handleTierChange(index, 'name', e.target.value)}
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
