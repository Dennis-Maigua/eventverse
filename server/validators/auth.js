const { check } = require('express-validator');

exports.signupValidator = [
    check('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long!')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Username can only contain alphabetic characters and spaces!'),
    check('email')
        .isEmail()
        .withMessage('A valid email is required!')
        .normalizeEmail()
        .withMessage('A valid email is required!'),
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long!')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least a lowercase letter, uppercase letter, digit, and special character!')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least a lowercase letter, uppercase letter, digit, and special character!')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least a lowercase letter, uppercase letter, digit, and special character!')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least a lowercase letter, uppercase letter, digit, and special character!')
];

exports.signinValidator = [
    check('email')
        .isEmail()
        .withMessage('A valid email is required!')
        .normalizeEmail()
        .withMessage('A valid email is required!'),
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long!')
];

exports.forgotValidator = [
    check('email')
        .isEmail()
        .withMessage('A valid email is required!')
        .normalizeEmail()
        .withMessage('A valid email is required!')
];

exports.resetValidator = [
    check('confirmPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long!')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least a lowercase letter, uppercase letter, digit, and special character!')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least a lowercase letter, uppercase letter, digit, and special character!')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least a lowercase letter, uppercase letter, digit, and special character!')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least a lowercase letter, uppercase letter, digit, and special character!')
];

exports.profileValidator = [
    check('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin!'),
    check('username')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long!')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Username can only contain alphabetic characters and spaces!'),
    check('email')
        .optional()
        .isEmail()
        .withMessage('A valid email is required!')
        .normalizeEmail()
        .withMessage('A valid email is required!'),
    check('password')
        .optional({ checkFalsy: true }) // This will skip validation if the password field is empty
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long!')
        .matches(/[a-z]/)
        .withMessage('Password must contain: a lowercase letter, uppercase letter, digit, and special character!')
        .matches(/[A-Z]/)
        .withMessage('Password must contain: a lowercase letter, uppercase letter, digit, and special character!')
        .matches(/[0-9]/)
        .withMessage('Password must contain: a lowercase letter, uppercase letter, digit, and special character!')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain: a lowercase letter, uppercase letter, digit, and special character!'),
    check('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Enter a valid mobile phone number!'),
    check('address')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Address must be at least 3 characters long!')
];

exports.contactValidator = [
    check('subject')
        .isLength({ min: 3 })
        .withMessage('Subject must be at least 3 characters long!')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Subject can only contain alphabetic characters and spaces!'),
    check('email')
        .isEmail()
        .withMessage('A valid email is required!')
        .normalizeEmail()
        .withMessage('A valid email is required!'),
    check('message')
        .optional()
        .isLength({ min: 50 })
        .withMessage('Message must be at least 50 characters long!')
];