const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tiers: [
        {
            type: { type: String, required: true },
            price: { type: Number, required: true },
            ticketCount: { type: Number, required: true },
            ticketRemaining: { type: Number, required: true }
        },
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);