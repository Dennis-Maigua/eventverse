import React, { useState } from 'react';
import Layout from '../core/Layout';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const Contact = () => {
    return (
        <Layout>
            <ToastContainer />
            <HeroSection />
            <section className='py-10 px-6 mx-auto'>
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
        <section className='bg-gray-600 text-white py-14'>
            <div className='container mx-auto px-6 text-center'>
                <h1 className='text-5xl font-bold mb-2'>
                    Contact
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Sending...' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/message/send`, { name, email, message }
            );

            console.log('CONTACT ENTRY SUCCESS:', response);
            toast.success(response.data.message);
            setValues({ ...values, name: '', email: '', message: '', buttonText: 'Sent' });
        }

        catch (err) {
            console.log('CONTACT ENTRY FAILED:', err);
            setValues({ ...values, buttonText: 'Send Message' });
            toast.error(err.response.data.error);
        }
    };

    return (
        <div className='p-0 md:p-4 lg:p-10'>
            <h3 className='text-2xl font-bold mb-6'> Get in Touch </h3>
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
                    type='text'
                    rows='5'
                    name='message'
                    value={message}
                    placeholder='Your Message'
                    onChange={handleChange}
                    className='p-3 shadow rounded'
                ></textarea>

                <button
                    className='py-3 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded'
                    type='submit'
                >
                    {buttonText}
                </button>
            </form>
        </div>
    );
};

const InfoSection = () => {
    return (
        <div className='pt-10 md:p-4 lg:p-10'>
            <h3 className='text-2xl font-bold mb-4'> Contact Information </h3>

            <div className='py-6 gap-4 flex flex-col'>
                <span>
                    If you have any questions, feel free to reach out to us at:
                </span>
                <span>
                    <strong> Email: </strong> support@eventverse.com
                </span>
                <span>
                    <strong>Phone: </strong> +254 712 345 678
                </span>
                <span>
                    <strong> Address: </strong> 1234 Street, Event City, NA 56789
                </span>
            </div>
        </div>
    );
};

export default Contact;
