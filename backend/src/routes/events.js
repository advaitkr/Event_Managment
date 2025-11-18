const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware.js');


router.get('/', eventController.getEvents);
router.post('/', protect, eventController.createEvent);
router.get('/:id', eventController.getEventById);
router.put('/:id', protect, eventController.updateEvent);
router.delete('/:id', protect, eventController.deleteEvent);


module.exports = router;