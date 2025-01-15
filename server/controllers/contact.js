const Contact = require('../models/contact');

const { contactEntryTemplate, mailTransport } = require('../utils/mail');

exports.sendMessage = async (req, res) => {
    const { subject, email, message } = req.body;

    try {
        const contactMessage = new Contact({ subject, email, message });

        await contactMessage.save()
            .then(() => {
                mailTransport().sendMail({
                    from: email,
                    to: process.env.APP_EMAIL,
                    subject: 'Contact Form Entry',
                    html: contactEntryTemplate(subject, email, message)
                });

                return res.json({
                    success: true,
                    message: `Message sent successfuly!`
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    error: 'Error sending message!'
                });
            });
    }

    catch (err) {
        return res.status(500).json({
            error: 'Error sending message!'
        });
    }
};

exports.markRead = async (req, res) => {
    const { _id, status } = req.body;

    try {
        const updateFields = {};

        updateFields.status = status.trim();

        const contactMessage = await Contact.findByIdAndUpdate(
            _id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!contactMessage) {
            return res.status(404).json({
                error: 'Message not found!'
            });
        }

        return res.json({
            success: true,
            message: `Message updated successfuly!`,
            contactMessage
        });
    }

    catch (err) {
        return res.status(500).json({
            error: 'Error updating message!'
        });
    }
};

exports.fetchMessages = async (req, res) => {
    try {
        const messages = await Contact.find();
        return res.json(messages);
    }

    catch (err) {
        return res.status(500).json({
            message: 'Error fetching messages!'
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
        return res.status(500).json({
            error: 'Error counting messages!'
        });
    }
}