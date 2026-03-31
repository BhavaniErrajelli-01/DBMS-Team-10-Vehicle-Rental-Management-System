const db = require('../config/db');

// User: Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { vehicle_id, start_date, end_date } = req.body;
    const user_id = req.user.id; // From protect middleware

    // Get vehicle price
    const [vehicles] = await db.query('SELECT price_per_day FROM vehicles WHERE vehicle_id = ? AND availability = true', [vehicle_id]);
    
    if (vehicles.length === 0) {
      return res.status(400).json({ message: 'Vehicle is not available' });
    }

    const price_per_day = vehicles[0].price_per_day;
    
    // Calculate total price based on dates (basic mock calc)
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return res.status(400).json({ message: 'Invalid dates' });

    const total_price = days * price_per_day;

    // Create booking
    const [result] = await db.execute(
      'INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)',
      [user_id, vehicle_id, start_date, end_date, total_price]
    );

    // Option: mark vehicle as unavailable here if needed, but for rental we might just check date overlaps.
    // We'll keep it simple for now and just create the booking.

    res.status(201).json({ 
      message: 'Booking created successfully', 
      bookingId: result.insertId,
      total_price
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// User: Get My Bookings
exports.getMyBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [bookings] = await db.query(`
      SELECT b.*, v.name as vehicle_name, v.image as vehicle_image 
      FROM bookings b 
      JOIN vehicles v ON b.vehicle_id = v.vehicle_id 
      WHERE b.user_id = ?
    `, [user_id]);
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Admin: Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, u.name as user_name, v.name as vehicle_name 
      FROM bookings b 
      JOIN users u ON b.user_id = u.user_id
      JOIN vehicles v ON b.vehicle_id = v.vehicle_id
    `);
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bookings', error: error.message });
  }
};

// Admin/User: Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const role = req.user.role;

    // If not admin, check if booking belongs to user
    if (role !== 'admin') {
      const [booking] = await db.query('SELECT user_id FROM bookings WHERE booking_id = ?', [id]);
      if (booking.length === 0 || booking[0].user_id !== user_id) {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }
    }

    await db.execute("UPDATE bookings SET status = 'cancelled' WHERE booking_id = ?", [id]);
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};

// Admin: Update Booking Status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.execute('UPDATE bookings SET status = ? WHERE booking_id = ?', [status, id]);
    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
}
