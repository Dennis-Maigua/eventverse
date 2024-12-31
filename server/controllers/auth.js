const User = require('../models/user');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const { mailTransport, resetPasswordTemplate, activateAccountTemplate,
    activationSuccessTemplate, resetSuccessTemplate } = require('../utils/mail');

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                error: 'Email already exists!'
            });
        }

        const token = jwt.sign({ name, email, password }, 
            process.env.JWT_ACCOUNT_ACTIVATION, 
            { expiresIn: '1h' });

        try {
            mailTransport().sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: 'Activate Your Account',
                html: activateAccountTemplate(`${process.env.CLIENT_URL}/activate-account/${token}`)
            });

            return res.json({
                success: true,
                message: `Activation link sent successfully!`
            });
        }

        catch (err) {
            return res.status(500).json({
                error: 'Error sending activation link!'
            });
        }
    }

    catch (err) {
        return res.status(500).json({
            error: 'Error signing up!'
        });
    }
};

exports.activate = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({
            error: 'Invalid token!'
        });
    }

    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async function (err, decoded) {
        const { name, email, password } = jwt.decode(token);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                error: 'Account is already activated!'
            });
        }

        if (err) {
            return res.status(403).json({
                error: 'Error verifying token!'
            });
        }

        const newUser = new User({ name, email, password });
        await newUser.save()
            .then(() => {
                mailTransport().sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Account Activation Success',
                    html: activationSuccessTemplate(`${process.env.CLIENT_URL}/signin`)
                });

                return res.json({
                    success: true,
                    message: `Account activated successfully!`
                });
            })
            .catch(err => {
                return res.status(500).json({
                    error: 'Error activating your account!'
                });
            });
    });
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Incorrect email or password!'
            });
        }

        user.lastLogin = Date.now();
        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        user.hashed_password = undefined;
        user.salt = undefined;

        return res.json({
            message: `Success! Welcome ${user.name}`,
            token,
            user
        });
    }

    catch (err) {
        return res.status(500).json({
            error: 'Error signing in!'
        });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        const token = jwt.sign({ _id: user._id, name: user.name },
            process.env.JWT_PASSWORD_RESET, { expiresIn: '1h' });

        return await user.updateOne({ resetPasswordLink: token })
            .then(() => {
                mailTransport().sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Reset Your Password',
                    html: resetPasswordTemplate(`${process.env.CLIENT_URL}/reset-password/${token}`)
                });;

                return res.json({
                    success: true,
                    message: 'Reset link sent successfully!'
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    error: 'Error sending reset link!'
                });
            });
    }

    catch (err) {
        return res.status(500).json({
            error: 'Error with forgot password!'
        });
    }
};

exports.resetPassword = async (req, res) => {
    const { resetPasswordLink, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            error: 'Passwords do not match!'
        });
    }

    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_PASSWORD_RESET, async function (err, decoded) {
            if (err) {
                return res.status(403).json({
                    error: 'Error verifying link!'
                });
            }

            try {
                let user = await User.findOne({ resetPasswordLink });
                if (!user) {
                    return res.status(401).json({
                        error: 'Expired link or User not found!'
                    });
                }

                if (user.authenticate(confirmPassword)) {
                    return res.status(401).json({
                        error: 'Please enter a different password!'
                    });
                }

                const updatedFields = {
                    password: confirmPassword,
                    resetPasswordLink: ''
                };

                user = _.extend(user, updatedFields);
                const email = user.email;

                return await user.save()
                    .then(() => {
                        mailTransport().sendMail({
                            from: process.env.EMAIL,
                            to: email,
                            subject: 'Reset Password Success',
                            html: resetSuccessTemplate(`${process.env.CLIENT_URL}/signin`)
                        });

                        return res.json({
                            message: `Password reset successful!`
                        });
                    })
                    .catch((err) => {
                        return res.status(500).json({
                            error: 'Error confirming password reset!'
                        });
                    });
            }

            catch (err) {
                return res.status(500).json({
                    error: 'Error resetting password!'
                });
            }
        });
    }
};

exports.requireSignin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Invalid token!'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) {
            return res.status(403).json({
                error: 'Error verifying token!'
            });
        }

        req.user = decoded;
        next();
    });
};

exports.adminOnly = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        if (user.role !== 'admin') {
            return res.status(401).json({
                error: 'Access denied.'
            });
        }

        req.profile = user;
        next();
    }

    catch (err) {
        return res.status(500).json({
            error: 'Error loading dashboard!'
        });
    }
};