import React, { useState } from 'react';
import Layout from '../components/Layout';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const Contact = () => {
    const [values, setValues] = useState({
        subject: '',
        email: '',
        message: '',
        buttonText: 'Send Message'
    });

    const { subject, email, message, buttonText } = values;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Sending...' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/message/send`, 
                { subject, email, message }
            );

            toast.success(response.data.message);
            setValues({ ...values, subject: '', email: '', message: '', buttonText: 'Sent' });
        }

        catch (err) {
            setValues({ ...values, buttonText: 'Send Message' });
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            <div className='bg-gray-500 text-white py-20'>
                <div className='container mx-auto px-4 md:px-8 text-center'>
                    <h1 className='text-3xl font-bold mb-2'>
                        Contact Us
                    </h1>
                </div>
            </div>
            
            <div className="flex flex-wrap px-4 md:px-8 py-16">
                <div className="w-full md:w-1/2 px-8 mb-16 md:mb-0">
                    <h3 className='text-xl font-bold mb-4'> Get in Touch </h3>
                    <form onSubmit={handleSubmit} className='flex flex-col bg-slate-100 rounded-lg border shadow-lg p-10 gap-4'>
                        <input
                            type='text'
                            name='subject'
                            value={subject}
                            placeholder='Subject'
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                        <input
                            type='email'
                            name='email'
                            value={email}
                            placeholder='Email'
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                        <textarea
                            rows='5'
                            type='text'
                            name='message'
                            value={message}
                            placeholder='Message'
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

                <div className="w-full md:w-1/2 px-8">
                    <h3 className='text-xl font-bold'> Contact Information </h3>

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
            </div>
        </Layout>
    );
};

export default Contact;
