const Event = require('../models/event');

exports.createEvent = async (req, res) => {
    try {
        const { name, date, price, ticketCount, description } = req.body;

        // Ensure all fields are provided
        if (!name || !date || !price || !ticketCount || !description) {
            return res.status(400).json({ 
                error: 'All fields are required!' 
            });
        }

        // Parse and validate the date
        const eventDate = new Date(date);
        if (eventDate <= Date.now()) {
            return res.status(400).json({ 
                error: 'Event date must be in the future!' 
            });
        }

        // Create the event
        const event = new Event({
            owner: req.user.id, // Populated by the requiresignin middleware
            name,
            date: eventDate,
            price,
            ticketCount,
            ticketRemaining: ticketCount,
            description,
            createdAt: Date.now(),
        });

        await event.save();

        res.json({ 
            success: true,
            message: 'Event created successfully!', 
            event 
        });
    } 

    catch (err) {
        console.log('ERROR CREATING EVENT: ', err);
        return res.status(500).json({
            error: 'Error creating event!'
        });
    }
};

exports.myEvents = async (req, res) => {
    try {
        const userId = req.user.id;

        const events = await Event.find({ owner: userId })
            .sort({ createdAt: -1 });

        return res.json(events);
    } 
    
    catch (err) {
        console.log('ERROR LOADING MY EVENTS: ', err);
        return res.status(500).json({
            error: 'Error loading my events!'
        });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { name, date, price, ticketCount, description } = req.body;
        const event = await Event.findById(req.params.id);

        // Fetch the event
        if (!event) {
            return res.status(404).json({ 
                error: 'Event not found!' 
            });
        }

        // Check if the user is the owner
        if (event.owner.toString() !== req.user._id) {
            return res.status(403).json({ 
                error: 'Access denied!' 
            });
        }

        // Validate new ticket count
        if (ticketCount < event.ticketCount - event.ticketRemaining) {
            return res.status(400).json({ 
                error: 'Cannot reduce ticket count below tickets already sold' 
            });
        }

        // Update the event
        event.name = name || event.name;
        event.date = date || event.date;
        event.price = price || event.price;
        event.ticketCount = ticketCount || event.ticketCount;
        event.ticketRemaining = ticketCount - (event.ticketCount - event.ticketRemaining);
        event.description = description || event.description;

        Object.assign(event, req.body);
        await event.save();

        res.json({ 
            success: true,
            message: 'Event updated successfully!', 
            event 
        });
    } 

    catch (err) {
        console.log('ERROR UPDATING EVENT: ', err);
        return res.status(500).json({
            error: 'Error updating event!'
        });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ 
                error: 'Event not found!' 
            });
        }

        if (event.owner.toString() !== req.user._id) {
            return res.status(403).json({ 
                error: 'Access denied!' 
            });
        }

        await event.remove();

        res.json({ 
            success: true,
            message: 'Event deleted successfully!'
        });
    } 
    
    catch (err) {
        console.log('ERROR DELETING EVENT: ', err);
        return res.status(500).json({
            error: 'Error deleting event!'
        });
    }
};

exports.allEvents = async (req, res) => {
    try {
        const events = await Event.find();

        // res.send(events);
        return res.json(events);
    } 
    
    catch (err) {
        console.log('ERROR FETCHING ALL EVENTS: ', err);
        return res.status(500).json({
            error: 'Error fetching all events!'
        });
    }
};

exports.loadDetails = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ 
                error: 'Event not found!' 
            });
        }

        return res.json(event);
    } 
    
    catch (err) {
        console.log('ERROR LOADING EVENT DETAILS: ', err);
        return res.status(500).json({
            error: 'Error loading event details!'
        });
    }
};