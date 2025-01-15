const Event = require('../models/event');
const Ticket = require('../models/ticket');

exports.createEvent = async (req, res) => {
    const { blockId, contractAddress, account, posterUrl, name, date, venue, tiers } = req.body;

    try {
        if (!blockId || !contractAddress || !account) {
            return res.status(400).json({ 
                error: 'Blockchain data is missing!' 
            });
        }

        if (!posterUrl || !name || !date || !venue.length) {
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
            if (!tier.name || !tier.price || tier.price <= 0 || tier.ticketsCount <= 0) {
                return res.status(400).json({
                    error: 'Enter a valid ticket name, price, and quantity!',
                });
            }
            tier.ticketsSold = 0;
        }

        const event = new Event({
            owner: req.user._id,
            blockId,
            contractAddress, 
            account,
            posterUrl,
            name,
            date: eventDate,
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

        console.log('LOAD USER EVENTS SUCCESSFUL: ', events);
        return res.json(events);
    } 
    
    catch (err) {
        console.log('ERROR LOADING USER EVENTS: ', err);
        return res.status(500).json({
            error: 'Error loading user events!'
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

exports.fetchEvents = async (req, res) => {
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

exports.buyTickets = async (req, res) => {
    const { eventId, txnHash, account, tickets, totalCost } = req.body; // Array of { tierId, quantity }
    const userId = req.user._id;

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ 
                error: 'Event not found!' 
            });
        }

        if (!txnHash || !account || !totalCost) {
            return res.status(400).json({ 
                error: 'Blockchain data is missing!' 
            });
        }

        let validationError = null;
        tickets.forEach(ticket => {
            const tier = event.tiers.id(ticket.tierId);
            if (!tier || tier.ticketsCount - tier.ticketsSold < ticket.quantity) {
                validationError = `Not enough ${tier ? tier.name : 'selected'} tickets available!`;
            }
        });
        
        if (validationError) {
            return res.status(400).json({ 
                error: validationError 
            });
        }
        
        tickets.forEach(ticket => {
            const tier = event.tiers.id(ticket.tierId);
            tier.ticketsSold += ticket.quantity;
        });

        // Update tier quantities in events
        await event.save();

        const userTickets = new Ticket({
            eventId,
            userId,
            txnHash, 
            account,
            tiers: tickets.map(ticket => {
                const tier = event.tiers.id(ticket.tierId);
                return {
                    name: tier.name,
                    price: tier.price,
                    quantity: ticket.quantity,
                };
            }),
            totalCost
        });

        // Save ticket details
        await userTickets.save();

        console.log('TICKETS PURCHASE SUCCESSFUL: ', userTickets);
        return res.json({ 
            success: true,
            message: 'Tickets purchased successfully!', 
            userTickets
        });
    }
    
    catch (err) {
        console.log('ERROR PURCHASING TICKETS: ', err);
        return res.status(500).json({
            error: 'Error purchasing tickets!'
        });
    }
};

exports.myTickets = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch tickets purchased by the user
        const tickets = await Ticket.find({ userId })
            .populate('eventId', 'posterUrl name date venue');

        console.log('LOAD USER TICKETS SUCCESSFUL: ', tickets);
        return res.json(tickets);
    } 
    
    catch (err) {
        console.log('ERROR LOADING USER TICKETS: ', err);
        return res.status(500).json({
            error: 'Error loading user tickets!'
        });
    }
};

exports.fetchTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();

        console.log('FETCH ALL TICKETS SUCCESSFUL: ', tickets);
        return res.json(tickets);
    } 
    
    catch (err) {
        console.log('ERROR FETCHING ALL TICKETS: ', err);
        return res.status(500).json({
            error: 'Error fetching all tickets!'
        });
    }
};