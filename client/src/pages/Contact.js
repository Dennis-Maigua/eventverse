import React, { useState } from 'react';
import Layout from '../core/Layout';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const Contact = () => {
    return (
        <Layout>
            <ToastContainer />
            <HeroSection />
            <section className='p-8 mx-auto'>
                <div className='grid grid-cols-1 lg:grid-cols-2'>
                    <FormSection />
                    <InfoSection />
                </div>
            </section>
        </Layout>
    );
};

const HeroSection = () => {
    return (
        <section className='bg-gray-600 text-white py-12'>
            <div className='container mx-auto px-6 text-center'>
                <h1 className='text-3xl font-bold mb-2'>
                    Contact Us
                </h1>
            </div>
        </section>
    );
};

const FormSection = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        message: '',
        buttonText: 'Send Message'
    });

    const { name, email, message, buttonText } = values;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Sending...' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/message/send`, 
                { name, email, message }
            );

            toast.success(response.data.message);
            setValues({ ...values, name: '', email: '', message: '', buttonText: 'Sent' });
        }

        catch (err) {
            setValues({ ...values, buttonText: 'Send Message' });
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <div className='p-0 md:p-4 lg:p-8 mb-8 md:m-0'>
            <h3 className='text-xl font-bold mb-8'> Get in Touch </h3>
            <form onSubmit={handleSubmit} className='flex flex-col bg-slate-100 rounded shadow p-10 gap-4'>
                <input
                    type='text'
                    name='name'
                    value={name}
                    placeholder='Your Name'
                    onChange={handleChange}
                    className='p-3 shadow rounded'
                />
                <input
                    type='email'
                    name='email'
                    value={email}
                    placeholder='Your Email'
                    onChange={handleChange}
                    className='p-3 shadow rounded'
                />
                <textarea
                    rows='5'
                    type='text'
                    name='message'
                    value={message}
                    placeholder='Your Message'
                    onChange={handleChange}
                    className='p-3 shadow rounded'
                />
                <input
                    type='submit'
                    value={buttonText}
                    className='py-3 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                />
            </form>
        </div>
    );
};

const InfoSection = () => {
    return (
        <div className='p-0 md:p-4 lg:p-8 m-8 md:m-0'>
            <h3 className='text-xl font-bold mb-4'> Contact Information </h3>

            <div className='py-6 gap-4 flex flex-col'>
                <span>
                    For further inquiries or information, kindly reach out to us:
                </span>
                <span>
                    <strong> Email: </strong> support@eventverse.com
                </span>
                <span>
                    <strong> Phone: </strong> +254 712 345 678
                </span>
                <span>
                    <strong> Address: </strong> 1234 Street, Event City, NA 56789
                </span>
            </div>
        </div>
    );
};

export default Contact;
