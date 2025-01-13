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
    txnHash: { type: String, required: true },
    account: { type: String, required: true },
    tiers: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true }
        },
    ],
    totalCost: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', TicketSchema);