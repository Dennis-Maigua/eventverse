import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Web3 from 'web3';
import EventContract from "../abis/EventContract.json";

import Layout from '../core/Layout';

const Ethers = () => {
    const [events, setEvents] = useState([]);

    const web3 = new Web3(window.ethereum); // Replace with your Ganache RPC URL
    const contractAddress = "0xDC35EB0d27463a4e21167Af93689d587D5586332"; // Replace with the deployed contract address
    const contract = new web3.eth.Contract(EventContract.abi, contractAddress);
    
    useEffect(() => {
        fetchEventDetails();
    }, []);

    const fetchEventDetails = async () => {
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

    return (
        <Layout>
            <ToastContainer />
            <div className="flex flex-wrap py-12 px-4 md:px-8">
                {events.map((event, i) => (
                    <div key={i} className="p-4 border shadow rounded">
                        <h3>Event {i}</h3>
                        <p>Owner: {event.owner}</p>
                        <p>Date: {event.date}</p>
                        <p>Active: {event.isActive ? "Yes" : "No"}</p>
                        <br/>
                        <h4>Tiers:</h4>
                        <ul>
                            {event.tiers.map((tier, j) => (
                                <li key={j}>
                                    {tier.name} - {tier.price} ETH ({tier.ticketsSold}/{tier.totalTickets} sold)
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}                
            </div>
        </Layout>
    );
};

export default Ethers;