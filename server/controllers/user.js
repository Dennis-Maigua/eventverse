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

        console.log('LOAD PROFILE SUCCESS:', req.user);
        return res.json(user);
    }

    catch (err) {
        console.log('LOAD PROFILE FAILED:', err);
        return res.status(500).json({
            error: 'Failed to read profile from database!'
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

        // Fetch the user to get the current password if a new password is not provided
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        // If a new password is provided, encrypt it and update hashed_password and salt
        if (password) {
            user.password = password.trim(); // This will trigger the virtual password setter
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

        console.log('UPDATE PROFILE SUCCESS:', req.user);
        return res.json(updatedUser);
    }

    catch (err) {
        console.log('UPDATE PROFILE FAILED:', err);
        return res.status(500).json({
            error: 'Failed to update profile! Please try again.'
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

        console.log('DELETE ACCOUNT SUCCESS:', req.user)
        return res.json({
            success: true,
            message: `Account deleted successfully!`,
            user
        });
    }

    catch (err) {
        console.log('DELETE ACCOUNT FAILED:', err);
        return res.status(500).json({
            error: 'Failed to delete account! Please try again.'
        });
    }
}

exports.fetchUsers = async (req, res) => {
    try {
        const users = await User.find();

        console.log('FETCH USERS SUCCESS!');
        return res.json(users);
    }

    catch (err) {
        console.log('FETCH USERS FAILED:', err);
        return res.status(500).json({
            message: 'Failed to fetch users from database!'
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
        console.log('COUNT ACTIVE USERS FAILED:', err);
        return res.status(500).json({ error: 'Failed to count active users!' });
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

        console.log('UPDATE USER SUCCESS:', req.user);
        return res.json(user);
    }

    catch (err) {
        console.log('UPDATE USER FAILED:', err);
        return res.status(500).json({
            error: 'Failed to update user! Please try again.'
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

        console.log('DELETE USER SUCCESS:', user)
        return res.json({
            success: true,
            message: `User deleted successfully!`,
            user
        });
    }

    catch (err) {
        console.log('DELETE USER FAILED:', err);
        return res.status(500).json({
            error: 'Failed to delete user! Please try again.'
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
        console.log('USER CREATION TRENDS FAILED:', err);
        return res.status(500).json({ error: 'Failed to fetch user creation trends!' });
    }
};
