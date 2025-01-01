import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '../core/Layout';
import { getCookie, isAuth, signout, updateUser } from '../utils/helpers';
import Avatar from '../assets/avatar.png';

const Profile = () => {
    const [values, setValues] = useState({
        role: '',
        name: '',
        email: '',
        password: '',
        profileUrl: '',
        phone: '',
        address: '',
        buttonText: 'Update'
    });

    const fileRef = useRef(null);
    const [image, setImage] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [imagePercent, setImagePercent] = useState(0);

    useEffect(() => {
        loadProfile();

        if (image) {
            handleUpload(image);
        }
    }, [image]);

    const token = getCookie('token');
    const navigate = useNavigate();
    const { role, profileUrl, name, email, password, phone, address, buttonText } = values;

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
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setValues({ ...values, profileUrl: downloadURL });
                    setImagePercent(100);
                });
            }
        );
    };

    const loadProfile = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/user/${isAuth()._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { role, profileUrl, name, email, phone, address } = response.data;
            setValues({ ...values, role, profileUrl, name, email, phone, address });
        }

        catch (err) {
            toast.error(err.response?.data?.error);

            if (err.response.status === 401) {
                signout(() => {
                    navigate('/signin')
                });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Updating' });

        if (image) {
            await handleUpload(image);
        }

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/user/update`, 
                values,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            updateUser(response, () => {
                setValues({ ...values, buttonText: 'Updated' });
                toast.success(response.data.message);
            });
        }

        catch (err) {
            setValues({ ...values, buttonText: 'Update' });
            toast.error(err.response?.data?.error);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account?');

        if (confirmDelete) {
            try {
                const response = await axios.delete(
                    `${process.env.REACT_APP_SERVER_URL}/user/delete`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.success(response.data.message);

                signout(() => {
                    navigate('/signin');
                });
            }

            catch (err) {
                toast.error(err.response?.data?.error);
            }
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <div className='bg-gray-600 text-white py-16'>
                <div className='container mx-auto px-4 md:px-8 text-center'>
                    <h1 className='text-3xl font-bold'> Profile </h1>
                </div>
            </div>

            <div className='max-w-2xl m-auto text-center flex flex-col gap-4 px-4 md:px-8 py-16'>
                <form onSubmit={handleUpdate} className='p-10 flex flex-col shadow rounded gap-4 bg-slate-100'>
                    <input
                        type='file'
                        ref={fileRef}
                        accept='image/*'
                        onChange={(e) => setImage(e.target.files[0])}
                        hidden
                    />
                    <img
                        src={profileUrl || values.profileUrl || Avatar}
                        alt='avatar'
                        name='profileUrl'
                        className='h-24 w-24 rounded-full self-center border object-cover cursor-pointer'
                        onClick={() => fileRef.current.click()}
                    />
                    <div className='text-sm text-center font-medium'>
                        {imageError ? (
                            <span className='text-red-500'>
                                Error! File size must be less than 2 MB.
                            </span>
                        )
                            : imagePercent > 0 && imagePercent < 100 ? (
                                <span className='text-slate-500'>
                                    Uploading: {imagePercent} %
                                </span>
                            )
                                : imagePercent === 100 ? (
                                    <span className='text-green-500'>
                                        Image uploaded successfully!
                                    </span>
                                )
                                    : null
                        }
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <select
                            name='role'
                            value={role}
                            onChange={handleChange}
                            className={`p-3 shadow rounded ${isAuth().role === 'user' ? 'bg-gray-100' : ''}`}
                            disabled={isAuth().role === 'user'}
                        >
                            <option value='' disabled> Select Role </option>
                            <option value='user'> user </option>
                            <option value='admin'> admin </option>
                        </select>

                        <input
                            type='email'
                            name='email'
                            value={email}
                            placeholder='Email'
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                            disabled={isAuth().role === 'user'}
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <input
                            type='text'
                            name='name'
                            value={name}
                            placeholder='Name'
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                        <input
                            type='password'
                            name='password'
                            value={password}
                            placeholder='Password'
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <input
                            type='phone'
                            name='phone'
                            value={phone}
                            placeholder='Phone'
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                        <input
                            type='text'
                            name='address'
                            value={address}
                            placeholder='Address'
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                    </div>
                    <input
                        type='submit'
                        value={buttonText}
                        className='py-2 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                    />
                </form>

                <span onClick={handleDelete} className='font-medium text-sm text-red-500 hover:opacity-80 cursor-pointer'> Delete Account </span>
            </div>
        </Layout>
    );
};

export default Profile;