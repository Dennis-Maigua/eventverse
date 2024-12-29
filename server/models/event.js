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
    price: { 
        type: Number, 
        required: true 
    },
    ticketCount: { 
        type: Number, 
        required: true 
    },
    ticketRemaining: { 
        type: Number, 
        required: true 
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('Event', EventSchema);