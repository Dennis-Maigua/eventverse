const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    eventId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    purchaseDate: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('Ticket', TicketSchema);