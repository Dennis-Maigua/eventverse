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
                error: 'Email is already taken!'
            });
        }

        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '1h' });

        try {
            mailTransport().sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: 'Activate Your Account',
                html: activateAccountTemplate(`${process.env.CLIENT_URL}/activate-account/${token}`)
            });

            console.log('EMAIL SENT SUCCESS');
            res.json({
                success: true,
                message: `Activation link sent to your email!`
            });
        }

        catch (err) {
            console.log('EMAIL NOT SENT:', err);
            return res.status(500).json({
                error: 'Problem with sendingactivation link!'
            });
        }
    }

    catch (err) {
        console.log('SIGN UP ERROR:', err);
        return res.status(500).json({
            error: 'Problem with sign up! Please try again.'
        });
    }
};

exports.activate = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({
            error: 'Access Denied!'
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
            console.log('ACCOUNT ACTIVATION ERROR:', err);
            return res.status(403).json({
                error: 'Invalid link! Please sign up again.'
            });
        }

        const newUser = new User({ name, email, password });
        await newUser.save()
            .then(() => {
                mailTransport().sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Activation Complete',
                    html: activationSuccessTemplate(`${process.env.CLIENT_URL}/signin`)
                });

                console.log(`EMAIL SENT SUCCESS`);
                res.json({
                    success: true,
                    message: `Hey ${name}, Welcome to EventVerse!`
                });
            })
            .catch((err) => {
                console.log('DATABASE/EMAIL ERROR:', err);
                return res.status(500).json({
                    error: 'Problem with database or sending email!'
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
            message: `Hey ${user.name}, Welcome back!`,
            token,
            user
        });
    }

    catch (err) {
        console.log('SIGN IN ERROR:', err);
        return res.status(500).json({
            error: 'Problem with sign in! Please try again.'
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

                console.log(`EMAIL SENT SUCCESS`);
                res.json({
                    success: true,
                    message: 'Reset link sent to your email!'
                });
            })
            .catch((err) => {
                console.log('DATABASE/EMAIL ERROR:', err);
                return res.status(500).json({
                    error: 'Problem with database or sending reset link!'
                });
            });
    }

    catch (err) {
        console.log('FORGOT PASSWORD ERROR:', err);
        return res.status(500).json({
            error: 'Problem with forgot password! Please try again.'
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
                console.log('JWT VERIFICATION ERROR:', err);
                return res.status(403).json({
                    error: 'Invalid link! Please reset again.'
                });
            }

            try {
                let user = await User.findOne({ resetPasswordLink });
                if (!user) {
                    return res.status(401).json({
                        error: 'Expired link! Please reset again.'
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
                            subject: 'Reset Complete',
                            html: resetSuccessTemplate(`${process.env.CLIENT_URL}/signin`)
                        });

                        console.log(`EMAIL SENT SUCCESS`);
                        return res.json({
                            message: `Hey ${user.name}, Welcome back!`
                        });
                    })
                    .catch((err) => {
                        console.log('DATABASE/EMAIL ERROR:', err);
                        return res.status(500).json({
                            error: 'Problem with database or sending email!'
                        });
                    });
            }

            catch (err) {
                console.log('RESET PASSWORD ERROR:', err);
                return res.status(500).json({
                    error: 'Problem with reset password! Please try again.'
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
            error: 'Access denied!'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) {
            console.log('JWT VERIFICATION ERROR:', err);
            return res.status(403).json({
                error: 'Invalid token! Please sign in again.'
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
        console.log('ADMIN DASHBOARD ERROR:', err);
        return res.status(500).json({
            error: 'Problem loading admin dashboard!'
        });
    }
};