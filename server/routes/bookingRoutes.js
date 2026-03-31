const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, bookingController.createBooking);
router.get('/mybookings', protect, bookingController.getMyBookings);
router.put('/:id/cancel', protect, bookingController.cancelBooking);

// Admin routes
router.get('/', protect, admin, bookingController.getAllBookings);
router.put('/:id/status', protect, admin, bookingController.updateBookingStatus);

module.exports = router;
