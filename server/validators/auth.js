const { check } = require('express-validator');

exports.signupValidator = [
    check('name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long!')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Name can only contain alphabetic characters and spaces!'),
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

exports.updateValidator = [
    check('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin!'),
    check('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long!')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Name can only contain alphabetic characters and spaces!'),
    check('email')
        .optional()
        .isEmail()
        .withMessage('A valid email is required!')
        .normalizeEmail()
        .withMessage('A valid email is required!'),
    check('password')
        .optional({ checkFalsy: true }) // This will skip validation if the password field is an empty string
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
    check('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long!')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Name can only contain alphabetic characters and spaces!'),
    check('email')
        .optional()
        .isEmail()
        .withMessage('A valid email is required!')
        .normalizeEmail()
        .withMessage('A valid email is required!'),
    check('message')
        .optional()
        .isLength({ min: 100 })
        .withMessage('Message must be at least 100 characters long!')
];