const Event = require('../models/event');
const Ticket = require('../models/ticket');

exports.buyTickets = async (req, res) => {
    const { eventId, quantity } = req.body;

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ 
                error: 'Event not found!' 
            });
        }

        if (event.ticketRemaining < quantity) {
            return res.status(400).json({ 
                error: 'Not enough tickets available!' 
            });
        }

        const ticket = new Ticket({
            eventId,
            userId: req.user._id,
            quantity,
        });

        await ticket.save();
        event.ticketRemaining -= quantity;
        await event.save();

        return res.json({ 
            success: true,
            message: 'Ticket purchased successfully!', 
            ticket 
        });
    } 
    
    catch (err) {
        console.log('ERROR PURCHASING TICKET: ', err);
        return res.status(500).json({
            error: 'Error purchasing ticket!'
        });
    }
};

exports.myTickets = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch tickets purchased by the user
        const tickets = await Ticket.find({ userId })
            .populate('eventId', 'name date price')
            .exec();

        return res.json(tickets);
    } 
    
    catch (err) {
        console.log('ERROR LOADING MY TICKETS: ', err);
        return res.status(500).json({
            error: 'Error loading my tickets!'
        });
    }
};

exports.transferTickets = async (req, res) => {
    try {
        const { eventId, quantity, recipientEmail } = req.body;

        // Validate input
        if (!eventId || !quantity || !recipientEmail) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Validate recipient user
        const recipient = await User.findOne({ email: recipientEmail });
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient user not found.' });
        }

        // Validate event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        if (event.date <= Date.now()) {
            return res.status(400).json({ message: 'Cannot transfer tickets for past events.' });
        }

        // Validate sender's tickets
        const senderTickets = await Ticket.findOne({
            eventId,
            userId: req.user.id,
        });
        if (!senderTickets || senderTickets.quantity < quantity) {
            return res.status(400).json({ message: 'Not enough tickets to transfer.' });
        }

        // Update sender's ticket quantity
        senderTickets.quantity -= quantity;
        if (senderTickets.quantity === 0) {
            await Ticket.findByIdAndDelete(senderTickets._id);
        } 
        else {
            await senderTickets.save();
        }

        // Update recipient's ticket quantity
        const recipientTickets = await Ticket.findOne({ eventId, userId: recipient._id });
        if (recipientTickets) {
            recipientTickets.quantity += quantity;
            await recipientTickets.save();
        } 
        else {
            const newTicket = new Ticket({
                eventId,
                userId: recipient._id,
                quantity,
                purchaseDate: new Date(),
            });
            await newTicket.save();
        }

        return res.json({ 
            success: true,
            message: 'Tickets transferred successfully!' 
        });
    } 
    
    catch (err) {
        console.log('ERROR TRANSFERRING TICKETS: ', err);
        return res.status(500).json({
            error: 'Error transferring tickets!'
        });
    }
};