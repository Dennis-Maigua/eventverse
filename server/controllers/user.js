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
    const { password, ...rest } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        const updateFields = Object.fromEntries(
            Object.entries(rest).filter(([_, value]) => 
                value?.trim()).map(([key, value]) => [key, value.trim()])
        );

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

        res.json({
            success: true,
            message: `Profile updated successfuly!`,
            updatedUser: {
                ...updatedUser.toObject(),
                hashed_password: undefined,
                salt: undefined,
            }
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
    try {
        const updateFields = Object.fromEntries(
            Object.entries(req.body).filter(([key, value]) => value?.trim())
        );

        const user = await User.findByIdAndUpdate(
            req.body.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        res.json({
            success: true,
            message: `User updated successfuly!`,
            user: { 
                ...user.toObject(), 
                hashed_password: undefined, 
                salt: undefined 
            }
        });
    }

    catch (err) {
        return res.status(500).json({
            error: 'Error updating user!.'
        });
    }
};

exports.deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    
    try {
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
