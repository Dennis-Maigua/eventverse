const express = require('express');
const router = express.Router();

const { createEvent, updateEvent, deleteEvent, myEvents, allEvents, loadDetails } 
    = require('../controllers/event');
const { buyTickets, myTickets, transferTickets } = require('../controllers/ticket');
const { requireSignin } = require('../controllers/auth');

// Routes for events
router.post('/event/create', requireSignin, createEvent);
router.put('/event/update/:id', requireSignin, updateEvent);
router.delete('/event/delete/:id', requireSignin, deleteEvent);
router.get('/events/my', requireSignin, myEvents);
router.get('/events/all', allEvents);
router.get('/event/details/:id', loadDetails);

// Routes for tickets
router.post('/tickets/buy', requireSignin, buyTickets);
router.get('/tickets/my', requireSignin, myTickets);
router.post('/tickets/transfer', requireSignin, transferTickets);

module.exports = router;
