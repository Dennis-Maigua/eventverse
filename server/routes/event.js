const express = require('express');
const router = express.Router();

const { createEvent, updateEvent, deleteEvent, myEvents, fetchEvents, loadDetails,
    buyTickets, myTickets, fetchTickets } = require('../controllers/event');
const { requireSignin } = require('../controllers/auth');

router.post('/event/create', requireSignin, createEvent);
router.put('/event/update/:id', requireSignin, updateEvent);
router.delete('/event/delete/:id', requireSignin, deleteEvent);
router.get('/events/my', requireSignin, myEvents);
router.get('/events/all', fetchEvents);
router.get('/event/details/:id', loadDetails);

router.post('/tickets/buy', requireSignin, buyTickets);
router.get('/tickets/my', requireSignin, myTickets);
router.get('/tickets/all', fetchTickets);

module.exports = router;
