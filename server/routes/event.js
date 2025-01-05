const express = require('express');
const router = express.Router();

const { createEvent, updateEvent, deleteEvent, myEvents, allEvents, loadDetails,
    buyTickets, myTickets } = require('../controllers/event');
const { requireSignin } = require('../controllers/auth');

router.post('/event/create', requireSignin, createEvent);
router.put('/event/update/:id', requireSignin, updateEvent);
router.delete('/event/delete/:id', requireSignin, deleteEvent);
router.get('/events/my', requireSignin, myEvents);
router.get('/events/all', allEvents);
router.get('/event/details/:id', loadDetails);

router.post('/tickets/buy', requireSignin, buyTickets);
router.get('/tickets/my', requireSignin, myTickets);

module.exports = router;
