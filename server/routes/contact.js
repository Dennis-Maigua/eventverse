const express = require('express');
const router = express.Router();

const { requireSignin, adminOnly } = require('../controllers/auth');
const { sendMessage, markRead, fetchMessages, countByStatus } = require('../controllers/contact');

const { contactValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

router.post('/message/send', contactValidator, runValidation, sendMessage);
router.put('/message/read', requireSignin, adminOnly, markRead);
router.get('/messages/all', requireSignin, adminOnly, fetchMessages);
router.get('/messages/count', requireSignin, adminOnly, countByStatus);

module.exports = router;