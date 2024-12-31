import React from 'react';
import { ToastContainer } from 'react-toastify';

import Layout from '../core/Layout';
import Avatar from '../assets/avatar.png';

const About = () => {
    return (
        <Layout>
            <ToastContainer />
            <HeroSection />
            <StorySection />
            <TeamSection />
        </Layout>
    );
};

const HeroSection = () => {
    return (
        <section className="bg-gray-600 text-white py-12">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-3xl font-bold mb-2">
                    About Us
                </h1>
            </div>
        </section>
    );
};

const StorySection = () => {
    return (
        <section className="py-16 bg-slate-100">
            <div className="flex flex-wrap mx-8">
                <div className="w-full md:w-1/2 px-8 mb-16 md:mb-0">
                    <h3 className="text-xl font-bold mb-4">Our Story</h3>
                    <p className="text-md">
                        Founded in 2024, our company was born out of a desire to make the management
                        of events and tickets more accessible to everyone. With a dedicated team of
                        professionals, we strive to innovate and improve our platform continuously.
                    </p>
                </div>

                <div className="w-full md:w-1/2 px-8">
                    <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                    <p className="text-md">
                        Our mission is to provide a secure, reliable, and easy-to-use platform for
                        managing events, ticketing, and reselling. We aim to simplify the process
                        of event management, ensuring ease of access for you and your loved ones.
                    </p>
                </div>
            </div>
        </section>
    );
};

const TeamSection = () => {
    return (
        <div className="py-16 text-center">
            <h3 className="text-xl font-bold mb-10">Meet the Team</h3>

            <div className="flex flex-wrap mx-8">
                <div className="w-full md:w-1/4 px-4 mb-8">
                    <div className="bg-slate-100 rounded-lg shadow p-8">
                        <img
                            className="w-20 h-20 rounded-full mx-auto mb-4"
                            src={Avatar}
                            alt="Team member"
                        />
                        <h4 className="font-bold mb-2">John Doe</h4>
                        <p className="text-gray-600">Founder</p>
                    </div>
                </div>

                <div className="w-full md:w-1/4 px-4 mb-8">
                    <div className="bg-slate-100 rounded-lg shadow p-8">
                        <img
                            className="w-20 h-20 rounded-full mx-auto mb-4"
                            src={Avatar}
                            alt="Team member"
                        />
                        <h4 className="font-bold mb-2">Jane Doe</h4>
                        <p className="text-gray-600">Director</p>
                    </div>
                </div>

                <div className="w-full md:w-1/4 px-4 mb-8">
                    <div className="bg-slate-100 rounded-lg shadow p-8">
                        <img
                            className="w-20 h-20 rounded-full mx-auto mb-4"
                            src={Avatar}
                            alt="Team member"
                        />
                        <h4 className="font-bold mb-2">Joe Smith</h4>
                        <p className="text-gray-600">Manager</p>
                    </div>
                </div>
                
                <div className="w-full md:w-1/4 px-4">
                    <div className="bg-slate-100 rounded-lg shadow p-8">
                        <img
                            className="w-20 h-20 rounded-full mx-auto mb-4"
                            src={Avatar}
                            alt="Team member"
                        />
                        <h4 className="font-bold mb-2">Jean Smith</h4>
                        <p className="text-gray-600">CEO</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;