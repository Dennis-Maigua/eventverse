import React, { useEffect } from 'react';
import Layout from '../core/Layout';
import { toast, ToastContainer } from 'react-toastify';
import { useEventContext } from '../utils/EventContext';

const Events = () => {
    return (
        <Layout>
            <ToastContainer />
            <HeroSection />
            <AllEventsSection />
        </Layout>
    );
};

const HeroSection = () => {
    return (
        <section className='bg-gray-600 text-white py-14'>
            <div className='container mx-auto px-6 text-center'>
                <h1 className='text-3xl font-bold mb-2'>
                    All Events
                </h1>
            </div>
        </section>
    );
};

const AllEventsSection = () => {

    return (
        <div>
            
        </div>
    );
};

export default Events;