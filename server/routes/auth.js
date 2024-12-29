const express = require('express');
const router = express.Router();

const { signup, activate, signin, forgotPassword, resetPassword } =
    require('../controllers/auth');

const { signupValidator, signinValidator, forgotValidator, resetValidator } =
    require('../validators/auth');
const { runValidation } = require('../validators');

router.post('/account/signup', signupValidator, runValidation, signup);
router.post('/account/activate', activate);
router.post('/account/signin', signinValidator, runValidation, signin);

router.put('/password/forgot', forgotValidator, runValidation, forgotPassword);
router.put('/password/reset', resetValidator, runValidation, resetPassword);

module.exports = router;