const Contact = require('../models/contact');

const { contactEntryTemplate, mailTransport } = require('../utils/mail');

exports.sendMessage = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const contactMessage = new Contact({ name, email, message });

        await contactMessage.save()
            .then(() => {
                mailTransport().sendMail({
                    from: email,
                    to: process.env.GMAIL_USER,
                    subject: 'Contact Form Entry',
                    html: contactEntryTemplate(name, email, message)
                });

                console.log('CONTACT ENTRY SUCCESS!');
                res.json({
                    success: true,
                    message: `Thank you for your message! We will get back to you soon.`
                });
            })
            .catch((err) => {
                console.log('EMAIL CONTACT ENTRY FAILED:', err);
                return res.status(500).json({
                    error: 'Failed to receive and email contact entry!'
                });
            });
    }

    catch (error) {
        console.error('SAVE CONTACT ENTRY FAILED:', error);
        res.status(500).json({
            error: 'Problem with saving contact entry in database!'
        });
    }
};

exports.update = async (req, res) => {
    const { _id, status } = req.body;

    try {
        const updateFields = {};

        updateFields.status = status.trim();

        const message = await Contact.findByIdAndUpdate(
            _id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!message) {
            return res.status(404).json({
                error: 'Message not found!'
            });
        }

        console.log('UPDATE MESSAGE SUCCESS:', message);
        return res.json(message);
    }

    catch (err) {
        console.log('UPDATE MESSAGE FAILED:', err);
        return res.status(500).json({
            error: 'Failed to update message!'
        });
    }
};

exports.fetchMessages = async (req, res) => {
    try {
        const messages = await Contact.find();

        console.log('FETCH MESSAGES SUCCESS!');
        return res.json(messages);
    }

    catch (err) {
        console.log('FETCH MESSAGES FAILED:', err);
        return res.status(500).json({
            message: 'Failed to fetch messages from database!'
        });
    }
};

exports.countByStatus = async (req, res) => {
    try {
        const unread = await Contact.countDocuments({ status: 'Unread' });
        const read = await Contact.countDocuments({ status: 'Read' });

        return res.json({
            unread,
            read
        });
    }

    catch (err) {
        console.log('COUNTING MESSAGES FAILED:', err);
        return res.status(500).json({
            error: 'Failed to count messages!'
        });
    }
}

exports.contactTrends = async (req, res) => {
    try {
        const trends = await Contact.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        return res.json(trends);
    }

    catch (err) {
        console.log('CONTACT ENTRY TRENDS FAILED:', err);
        return res.status(500).json({ error: 'Failed to fetch contact entry trends!' });
    }
};