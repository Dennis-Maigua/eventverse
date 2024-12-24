import React from 'react';
import Layout from '../core/Layout';
import { ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import { isAuth } from '../utils/helpers';

const App = () => {
  return (
    <Layout>
      <ToastContainer />
      <HeroSection />
      <HowItWorksSection />
      <TestimonialsSection />
    </Layout>
  );
};

const HeroSection = () => {
  return (
    <section className="bg-gray-600 text-white py-28">
      <div className="m-auto flex flex-col items-center text-center gap-4 px-4">
        <h1 className="text-3xl font-bold mb-2">
          Events and Tickets Available
        </h1>

        <p className="mb-2">
          Easy, reliable, and secure platform for buying local event tickets.
        </p>

        {!isAuth() ? (
          <Link to="/signup" className="py-2 px-3 font-semibold text-white bg-red-500 hover:opacity-80 shadow rounded">
            Buy Now
          </Link>
        ) : (
          <Link to="/events" className="py-3 px-4 font-semibold text-white bg-red-500 hover:opacity-80 shadow rounded">
            Buy Now
          </Link>
        )}
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-slate-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold mb-10"> How It Works </h2>

        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white rounded-lg shadow p-10">
              <h3 className="font-bold mb-4"> 1. Sign Up </h3>
              <p> Register on our platform to get started. It is quick and easy! </p>
            </div>
          </div>

          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white rounded-lg shadow p-10">
              <h3 className="font-bold mb-4"> 2. Search Event </h3>
              <p> Explore and find your local event from anywhere, anytime. </p>
            </div>
          </div>

          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white rounded-lg shadow p-10">
              <h3 className="font-bold mb-4"> 3. Buy Tickets </h3>
              <p> Follow our simple step-by-step process to buy your tickets. </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold mb-10"> Testimonials </h2>

        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-slate-100 rounded-lg shadow p-10">
              <p className="italic">
                "This platform made it so easy to purchase tickets. I feel at ease knowing my tickets are legit."
              </p>
              <p className="mt-4 font-bold">Martin Kelly</p>
            </div>
          </div>

          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-slate-100 rounded-lg shadow p-10">
              <p className="italic">
                "The process was straightforward, and I was able to get my ticket effortlessly. Highly recommend!"
              </p>
              <p className="mt-4 font-bold">Ana Smith</p>
            </div>
          </div>

          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-slate-100 rounded-lg shadow p-10">
              <p className="italic">
                "The security and ease of use are top-notch. I trust this platform with my ticket purchases."
              </p>
              <p className="mt-4 font-bold">Brian Williams</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default App;
