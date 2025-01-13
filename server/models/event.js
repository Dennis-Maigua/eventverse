const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    eventId: { type: String, required: true },
    contractAddress: { type: String, required: true },
    account: { type: String, required: true },
    posterUrl: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    venue: [
        {
            name: { type: String, required: true },
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true }
        },
    ],
    tiers: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            ticketsCount: { type: Number, required: true },
            ticketsSold: { type: Number, default: 0 }
        },
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);