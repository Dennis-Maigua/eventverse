import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import EventContract from "../build/contracts/EventContract.json";

import Layout from '../components/Layout';

const Ethers = () => {
    const [events, setEvents] = useState([]);

    const web3 = new Web3(window.ethereum);
    const contractAddress = process.env.REACT_APP_DEPLOYED_CONTRACT; // Replace with the deployed contract address
    const contract = new web3.eth.Contract(EventContract.abi, contractAddress);
    
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            // Get the total number of events
            const eventCount = await contract.methods.eventCount().call();
            console.log(`Total Events: ${eventCount}`);

            if (eventCount === 0) {
                console.log("No events found.");
                return;
            }

            const fetchedEvents = [];
    
            for (let i = 0; i < eventCount; i++) {
                // Fetch each event by ID
                const event = await contract.methods.events(i).call();
                const tierDetails = await contract.methods.getEventTiers(i).call();

                const tiers = tierDetails[0].map((name, index) => ({
                    name,
                    price: web3.utils.fromWei(tierDetails[1][index], "ether"),
                    totalTickets: tierDetails[2][index],
                    ticketsSold: tierDetails[3][index],
                }));

                fetchedEvents.push({ ...event, tiers });
            }

            setEvents(fetchedEvents);
        } 

        catch (err) {
            console.error("Error fetching event details: ", err);
        }
    };

    // const fetchEvent = async () => {
    //     try {
    //         // Fetch the single event directly since eventCount is 1
    //         const event = await contract.methods.events(0).call();
    //         const tierDetails = await contract.methods.getEventTiers(0).call();

    //         const tiers = tierDetails[0].map((name, index) => ({
    //             name,
    //             price: web3.utils.fromWei(tierDetails[1][index], "ether"),
    //             totalTickets: tierDetails[2][index],
    //             ticketsSold: tierDetails[3][index],
    //         }));

    //         const fetchedEvent = { ...event, tiers };

    //         // Set the fetched event as an array with one element
    //         setEvents([fetchedEvent]);
    //     } 

    //     catch (err) {
    //         console.error("Error fetching event details: ", err);
    //     }
    // };

    return (
        <Layout>
            <div className="flex flex-wrap py-12 px-4 md:px-8">
                {events.map((event, i) => (
                    <div key={i} className="p-4 w-full md:w-1/2 lg:w-1/3">
                        <h3><strong>Event {i}</strong></h3>
                        <p><u>Owner:</u> {event.owner}</p>
                        <br/>
                        <p><u>Poster URL:</u> {event.posterUrl}</p>
                        <p><u>Name:</u> {event.name}</p>
                        <p><u>Date:</u> {new Date(event.date).toLocaleDateString()}</p>
                        <p><u>Active:</u> {event.isActive ? "Yes" : "No"}</p>
                        <br/>
                        <h4><strong>Venue:</strong></h4>
                        <p><u>Name:</u> {event.venue.name}</p>
                        <p><u>Latitude:</u> {parseFloat(event.venue.latitude)}</p>
                        <p><u>Longitude:</u> {parseFloat(event.venue.longitude)}</p>
                        <br/>
                        <h4><strong>Tiers:</strong></h4>
                        <ul>
                            {event.tiers.map((tier, j) => (
                                <li key={j}>
                                    <u>{tier.name}</u> - {tier.price} ETH - ({tier.ticketsSold}/{tier.totalTickets} sold)
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}                
            </div>
            
            {/* <div className="flex flex-wrap py-12 px-4 md:px-8">
                {events.length === 0 ? (
                    <div className='max-w-lg m-auto flex items-center text-center px-4 md:px-8 py-12'>
                        <h1 className='text-xl'> No events found. </h1>
                    </div>
                ) : (
                    events.map((event, i) => (
                        <div key={i} className="p-4 border shadow rounded w-full md:w-1/2 lg:w-1/3">
                            <h3 className="text-lg font-bold mb-2">Event ID: {i + 1}</h3>
                            <p><u>Name:</u> {event.name}</p>
                            <p><u>Date:</u> {new Date(event.date).toLocaleDateString()}</p>
                            <p><u>Active:</u> {event.isActive ? "Yes" : "No"}</p>
                            <p><u>Owner:</u> {event.owner}</p>
                            <p><u>Poster URL:</u> {event.posterUrl || "N/A"}</p>
                            <br />
                            {event.venue ? (
                                <>
                                    <h4 className="font-bold">Venue:</h4>
                                    <p><u>Name:</u> {event.venue.name || "N/A"}</p>
                                    <p><u>Latitude:</u> {parseFloat(event.venue.latitude || 0)}</p>
                                    <p><u>Longitude:</u> {parseFloat(event.venue.longitude || 0)}</p>
                                    <br />
                                </>
                            ) : (
                                <p><u>Venue:</u> Not available</p>
                            )}
                            <h4 className="font-bold">Tiers:</h4>
                            {event.tiers && event.tiers.length > 0 ? (
                                <ul>
                                    {event.tiers.map((tier, j) => (
                                        <li key={j}>
                                            <u>{tier.name}:</u> {tier.price} ETH ({tier.ticketsSold}/{tier.totalTickets} sold)
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No tiers available</p>
                            )}
                        </div>
                    ))
                )}
            </div> */}
        </Layout>
    );
};

export default Ethers;