const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    status: {
        type: String,
        default: 'Unread',
    },
    subject: String,
    email: String,
    message: String
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Contact', contactSchema);