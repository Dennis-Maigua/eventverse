import React from 'react';
import Layout from '../components/Layout';
import { ToastContainer } from 'react-toastify';

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
        <section className="bg-gray-500 text-white py-60">
            <div className="m-auto flex flex-col items-center text-center gap-6 px-4 md:px-8">
                <h1 className="text-3xl font-bold"> Hello, and Welcome! </h1>
                <p> Explore Worldwide Events and Buy Tickets Online via Blockchain. </p>
            </div>
        </section>
    );
};

const CategoriesSection = () => {
    return (
        <section className="py-20 text-center bg-slate-100 font-bold">
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
        <section className="py-20 text-center">
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