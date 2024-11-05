const express = require('express');
const router = express.Router();

const { requireSignin, adminOnly } = require('../controllers/auth');
const { sendMessage, update, fetchMessages, countByStatus, contactTrends } = require('../controllers/contact');

const { contactValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

router.post('/message/send', contactValidator, runValidation, sendMessage);
router.put('/message/update', requireSignin, adminOnly, update);
router.get('/messages/fetch', requireSignin, adminOnly, fetchMessages);
router.get('/messages/count', requireSignin, adminOnly, countByStatus);
router.get('/messages/trends', requireSignin, adminOnly, contactTrends);

module.exports = router;