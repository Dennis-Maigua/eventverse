const Event = require('../models/event');

exports.createEvent = async (req, res) => {
    const { name, date, price, ticketCount, description } = req.body;
    
    try {
        // Ensure all fields are provided
        if (!name || !date || !price || !ticketCount || !description) {
            return res.status(400).json({ 
                error: 'All fields are required!' 
            });
        }

        const eventDate = new Date(date);
        if (eventDate <= Date.now()) {
            return res.status(400).json({ 
                error: 'Event date must be in the future!' 
            });
        }

        const event = new Event({
            organizer: req.user._id,
            name,
            date: eventDate,
            price,
            ticketCount,
            ticketRemaining: ticketCount,
            description,
            createdAt: Date.now(),
        });

        await event.save();
        console.log('CREATE EVENT SUCCESSFUL: ', event)

        return res.json({ 
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
    const userId = req.user._id;
    
    try {
        const events = await Event.find({ organizer: userId });
        if (!events) {
            return res.status(404).json({
                error: 'User events not found!'
            });
        }

        console.log('LOAD MY EVENTS SUCCESSFUL: ', events)
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
    const { name, date, description } = req.body;
    
    try {
        const event = await Event.findById(req.params.id);

        // Fetch the event
        if (!event) {
            return res.status(404).json({ 
                error: 'Event not found!' 
            });
        }

        // Check if the user is the organizer
        if (event.organizer.toString() !== req.user._id) {
            return res.status(403).json({ 
                error: 'Access denied!' 
            });
        }

        // Update the event
        event.name = name || event.name;
        event.date = date || event.date;
        event.description = description || event.description;

        await event.save();
        console.log('UPDATE EVENT SUCCESSFUL:', event)

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
    const event = await Event.findByIdAndDelete(req.params.id);

    try {
        if (!event) {
            return res.status(404).json({ 
                error: 'Event not found!' 
            });
        }

        if (event.organizer.toString() !== req.user._id) {
            return res.status(403).json({ 
                error: 'Access denied!' 
            });
        }

        console.log('DELETE EVENT SUCCESSFUL:', event)
        res.json({ 
            success: true,
            message: 'Event deleted successfully!',
            event
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

        console.log('FETCH ALL EVENTS SUCCESSFUL: ', events);
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
    const event = await Event.findById(req.params.id);

    try {
        if (!event) {
            return res.status(404).json({ 
                error: 'Event not found!' 
            });
        }

        console.log('LOAD EVENT DETAILS SUCCESSFUL: ', event);
        return res.json(event);
    } 
    
    catch (err) {
        console.log('ERROR LOADING EVENT DETAILS: ', err);
        return res.status(500).json({
            error: 'Error loading event details!'
        });
    }
};