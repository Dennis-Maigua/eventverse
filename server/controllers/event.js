const Event = require('../models/event');

exports.createEvent = async (req, res) => {
    const { posterUrl, name, date, category, description, venue, tiers } = req.body;
    
    try {
        // Ensure all fields are provided
        if (!posterUrl || !name || !date || !category || !description || !venue.length) {
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

        // Ensure at least one tier is provided
        if (!Array.isArray(tiers) || tiers.length === 0) {
            return res.status(400).json({
                error: 'At least one pricing tier is required!',
            });
        }

        // Validate tiers
        for (const tier of tiers) {
            if (!tier.name || !tier.price || tier.ticketCount <= 0) {
                return res.status(400).json({
                    error: 'Enter a valid ticket name, price, and quantity!',
                });
            }

            tier.ticketRemaining = tier.ticketCount;
        }

        const event = new Event({
            owner: req.user._id,
            posterUrl,
            name,
            date: eventDate,
            category,
            description,
            venue,
            tiers
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
        const events = await Event.find({ owner: userId });
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

        Object.assign(event, { ...req.body });

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

        if (event.owner.toString() !== req.user._id) {
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