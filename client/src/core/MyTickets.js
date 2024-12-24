import React, { useEffect } from 'react';
import Layout from './Layout';
import { toast, ToastContainer } from 'react-toastify';
import { useEventContext } from '../utils/EventContext';

const MyTickets = () => {
    return (
        <Layout>
            <ToastContainer />
            <HeroSection />
            <MyTicketsSection />
        </Layout>
    );
};

const HeroSection = () => {
    return (
        <section className='bg-gray-600 text-white py-14'>
            <div className='container mx-auto px-6 text-center'>
                <h1 className='text-3xl font-bold mb-2'>
                    My Tickets
                </h1>
            </div>
        </section>
    );
};

const MyTicketsSection = () => {
  
    return (
        <div>
            
        </div>
    );
  };

export default MyTickets;