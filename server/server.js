require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const initDb = require('./config/initDb');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Main init block
async function startServer() {
  console.log('Initializing Database...');
  await initDb();

  // Define routes
  const authRoutes = require('./routes/authRoutes');
  const vehicleRoutes = require('./routes/vehicleRoutes');
  const bookingRoutes = require('./routes/bookingRoutes');
  // const paymentRoutes = require('./routes/paymentRoutes');

  app.use('/api/auth', authRoutes);
  app.use('/api/vehicles', vehicleRoutes);
  app.use('/api/bookings', bookingRoutes);
  // app.use('/api/payments', paymentRoutes);

  app.get('/', (req, res) => {
    res.send('Vehicle Rental API is running...');
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n=================================\n`);
    console.log(`Server is successfully running!`);
    console.log(`Click to test Safe Ride Application: http://localhost:5173/`);
    console.log(`\n=================================\n`);
  });
}

startServer();
