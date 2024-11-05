const express = require('express');
const router = express.Router();

const { signup, activate, signin, forgotPassword, resetPassword } =
    require('../controllers/auth');

const { signupValidator, signinValidator, forgotValidator, resetValidator } =
    require('../validators/auth');
const { runValidation } = require('../validators');

router.post('/signup', signupValidator, runValidation, signup);
router.post('/activate-account', activate);
router.post('/signin', signinValidator, runValidation, signin);

router.put('/forgot-password', forgotValidator, runValidation, forgotPassword);
router.put('/reset-password', resetValidator, runValidation, resetPassword);

module.exports = router;