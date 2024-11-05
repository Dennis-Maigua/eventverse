const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            default: 'Unread',
        },
        name: String,
        email: String,
        message: String
    },
    { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);