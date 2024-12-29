const User = require('../models/user');

exports.loadProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        user.hashed_password = undefined;
        user.salt = undefined;

        return res.json(user);
    }

    catch (err) {
        return res.status(500).json({
            error: 'Error loading profile!'
        });
    }
};

exports.updateProfile = async (req, res) => {
    const { role, profileUrl, name, email, password, phone, address } = req.body;

    try {
        const updateFields = {};

        if (role) updateFields.role = role.trim();
        if (profileUrl) updateFields.profileUrl = profileUrl.trim();
        if (name) updateFields.name = name.trim();
        if (email) updateFields.email = email.trim();
        if (phone) updateFields.phone = phone.trim();
        if (address) updateFields.address = address.trim();

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        if (password) {
            user.password = password.trim();
            updateFields.hashed_password = user.hashed_password;
            updateFields.salt = user.salt;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        updatedUser.hashed_password = undefined;
        updatedUser.salt = undefined;

        res.json({
            success: true,
            message: `Profile updated successfuly!`,
            updatedUser
        });
    }

    catch (err) {
        return res.status(500).json({
            error: 'Error updating profile!.'
        });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        user.hashed_password = undefined;
        user.salt = undefined;

        return res.json({
            success: true,
            message: `Account deleted successfully!`,
            user
        });
    }

    catch (err) {
        return res.status(500).json({
            error: 'Error deleting account!'
        });
    }
}

exports.fetchUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    }

    catch (err) {
        return res.status(500).json({
            error: 'Error fetching users!'
        });
    }
};

exports.activeUsers = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activeUsers = await User.countDocuments({ lastLogin: { $gte: thirtyDaysAgo } });
        return res.json({
            active: activeUsers
        });
    }

    catch (err) {
        return res.status(500).json({ 
            error: 'Error counting active users!' 
        });
    }
};

exports.updateUser = async (req, res) => {
    const { id, role, profileUrl, name, email, phone, address } = req.body;

    try {
        const updateFields = {};

        if (role) updateFields.role = role.trim();
        if (profileUrl) updateFields.profileUrl = profileUrl.trim();
        if (name) updateFields.name = name.trim();
        if (email) updateFields.email = email.trim();
        if (phone) updateFields.phone = phone.trim();
        if (address) updateFields.address = address.trim();

        const user = await User.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        user.hashed_password = undefined;
        user.salt = undefined;

        res.json({
            success: true,
            message: `User updated successfuly!`,
            user
        });
    }

    catch (err) {
        return res.status(500).json({
            error: 'Error updating user!.'
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        user.hashed_password = undefined;
        user.salt = undefined;

        return res.json({
            success: true,
            message: `User deleted successfully!`,
            user
        });
    }

    catch (err) {
        return res.status(500).json({
            error: 'Error deleting user!'
        });
    }
}

exports.userTrends = async (req, res) => {
    try {
        const trends = await User.aggregate([
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
        return res.status(500).json({ 
            error: 'Error loading users trends!' 
        });
    }
};
