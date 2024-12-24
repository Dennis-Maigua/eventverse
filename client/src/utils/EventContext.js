import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';

// Create Context
const EventContext = createContext();

const initialState = {
    events: [],
    tickets: [],
    loading: false,
    error: null,
};

// Reducer Function
const eventReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_EVENTS_SUCCESS':
        return { ...state, events: action.payload, loading: false };
        case 'FETCH_TICKETS_SUCCESS':
        return { ...state, tickets: action.payload, loading: false };
        case 'SET_LOADING':
        return { ...state, loading: true };
        case 'SET_ERROR':
        return { ...state, error: action.payload, loading: false };
        default:
        return state;
    }
};

// Context Provider
export const EventProvider = ({ children }) => {
    const [state, dispatch] = useReducer(eventReducer, initialState);

    // Fetch All Events
    const fetchEvents = async () => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.get('/api/events');
            dispatch({ type: 'FETCH_EVENTS_SUCCESS', payload: response.data });
        } 
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    // Fetch My Tickets
    const fetchTickets = async () => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.get('/api/tickets/my');
            dispatch({ type: 'FETCH_TICKETS_SUCCESS', payload: response.data });
        } 
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    return (
        <EventContext.Provider value={{ ...state, fetchEvents, fetchTickets }}>
            {children}
        </EventContext.Provider>
    );
};

// Custom Hook to Use Context
export const useEventContext = () => useContext(EventContext);
