import React from 'react';
import Layout from '../core/Layout';
import { ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import { isAuth } from '../utils/AuthHelpers';

import Logo from '../assets/logo.png';

const Home = () => {
    return (
        <Layout>
            <ToastContainer />
            <HeroSection />
            <CategoriesSection />
            <TestimonialsSection />
        </Layout>
    );
};

const HeroSection = () => {
    return (
        <section className="bg-gray-500 text-white py-28">
            <div className="m-auto flex flex-col items-center text-center gap-4 px-4 md:px-8">
                <h1 className="text-3xl font-bold mb-2"> Hello there, Welcome! </h1>
                <p className="mb-2"> Explore Worldwide Events and Buy Tickets Online via Blockchain. </p>

                <section className='grid grid-cols-2 gap-4'>
                    <Link to="/events" className="py-2 px-3 font-semibold text-white bg-red-500 hover:opacity-80 shadow rounded">
                        Browse All
                    </Link>

                    {!isAuth() ? (
                        <Link to="/signup" className="py-2 px-3 font-semibold text-black bg-white hover:opacity-80 shadow rounded">
                            Get Started
                        </Link>
                    ) : (
                        <Link to="/create-event" className="py-2 px-3 font-semibold text-black bg-white hover:opacity-80 shadow rounded">
                            Create Event
                        </Link>
                    )}
                </section>
            </div>
        </section>
    );
};

const CategoriesSection = () => {
    return (
        <section className="py-12 text-center bg-slate-100 font-bold">
            <h2 className="text-2xl mb-8"> Event Categories </h2>

            <div className="flex flex-wrap px-4 md:px-8">
                <div className="w-1/3 lg:w-1/6 px-2 mb-4">
                    <div className="flex flex-col items-center bg-white rounded-lg shadow py-4">
                        <img src={Logo} className='h-12' alt='logo' />
                        <h3> Arts </h3>
                    </div>
                </div>

                <div className="w-1/3 lg:w-1/6 px-2 mb-4">
                    <div className="flex flex-col items-center bg-white rounded-lg shadow py-4">
                        <img src={Logo} className='h-12' alt='logo' />
                        <h3> Business </h3>
                    </div>
                </div>

                <div className="w-1/3 lg:w-1/6 px-2 mb-4">
                    <div className="flex flex-col items-center bg-white rounded-lg shadow py-4">
                        <img src={Logo} className='h-12' alt='logo' />
                        <h3> Entertainment </h3>
                    </div>
                </div>

                <div className="w-1/3 lg:w-1/6 px-2">
                    <div className="flex flex-col items-center bg-white rounded-lg shadow py-4">
                        <img src={Logo} className='h-12' alt='logo' />
                        <h3> Socio-Cultural </h3>
                    </div>
                </div>

                <div className="w-1/3 lg:w-1/6 px-3">
                    <div className="flex flex-col items-center bg-white rounded-lg shadow py-4">
                        <img src={Logo} className='h-12' alt='logo' />
                        <h3> Sports </h3>
                    </div>
                </div>

                <div className="w-1/3 lg:w-1/6 px-2">
                    <div className="flex flex-col items-center bg-white rounded-lg shadow py-4">
                        <img src={Logo} className='h-12' alt='logo' />
                        <h3> Technology </h3>
                    </div>
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection = () => {
    return (
        <section className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-12"> Testimonials </h2>

            <div className="flex flex-wrap px-4 md:px-8">
                <div className="w-1/2 lg:w-1/4 px-2 mb-4">
                    <div className="bg-slate-100 rounded-lg shadow p-8">
                        <p className="italic">
                            "Buying tickets has never been this simple and secure! I love that I can transfer tickets to friends effortlessly."
                        </p>
                        <p className="mt-4 font-bold"> Emily R. </p>
                    </div>
                </div>

                <div className="w-1/2 lg:w-1/4 px-2 mb-4">
                    <div className="bg-slate-100 rounded-lg shadow p-8">
                        <p className="italic">
                            "The ticketing system is seamless, and the ability to track sales and attendance makes my job so much easier!"
                        </p>
                        <p className="mt-4 font-bold"> John M. </p>
                    </div>
                </div>

                <div className="w-1/2 lg:w-1/4 px-2">
                    <div className="bg-slate-100 rounded-lg shadow p-8">
                        <p className="italic">
                            "I appreciate the flexible pricing tiers. It’s so convenient to find and buy tickets to events near me!"
                        </p>
                        <p className="mt-4 font-bold"> Sophia L. </p>
                    </div>
                </div>

                <div className="w-1/2 lg:w-1/4 px-2">
                    <div className="bg-slate-100 rounded-lg shadow p-8">
                        <p className="italic">
                            "The blockchain integration is incredible! This platform has revolutionized the way I handle events"
                        </p>
                        <p className="mt-4 font-bold"> David K. </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;