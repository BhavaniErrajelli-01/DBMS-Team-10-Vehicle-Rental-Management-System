const db = require('../config/db');

// Get all vehicles
exports.getVehicles = async (req, res) => {
  try {
    const [vehicles] = await db.query('SELECT * FROM vehicles');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
};

// Get single vehicle
exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const [vehicles] = await db.query('SELECT * FROM vehicles WHERE vehicle_id = ?', [id]);
    
    if (vehicles.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.json(vehicles[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle' });
  }
};

// Any authenticated user: Add vehicle
exports.addVehicle = async (req, res) => {
  try {
    const { name, type, price_per_day, availability, speed, vehicle_number } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const [result] = await db.execute(
      'INSERT INTO vehicles (name, type, price_per_day, availability, image, speed, vehicle_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, type, price_per_day, availability !== undefined ? availability : true, imageUrl, speed || null, vehicle_number || null]
    );
    
    res.status(201).json({ message: 'Vehicle added successfully', vehicleId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding vehicle', error: error.message });
  }
};

// Admin: Update vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, price_per_day, availability, image, speed, vehicle_number } = req.body;
    
    await db.execute(
      'UPDATE vehicles SET name = ?, type = ?, price_per_day = ?, availability = ?, image = ?, speed = ?, vehicle_number = ? WHERE vehicle_id = ?',
      [name, type, price_per_day, availability, image, speed, vehicle_number, id]
    );
    
    res.json({ message: 'Vehicle updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating vehicle', error: error.message });
  }
};

// Admin: Delete vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM vehicles WHERE vehicle_id = ?', [id]);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vehicle', error });
  }
};

// Any user: Delete vehicle by exact match
exports.deleteVehicleByMatch = async (req, res) => {
  try {
    const { name, type, price_per_day, speed, vehicle_number } = req.body;
    
    // First, try to find a vehicle that matches exactly
    const [vehicles] = await db.execute(
      'SELECT vehicle_id FROM vehicles WHERE name = ? AND type = ? AND price_per_day = ? AND speed = ? AND vehicle_number = ?',
      [name, type, price_per_day, speed, vehicle_number]
    );

    if (vehicles.length === 0) {
      return res.status(404).json({ message: 'No vehicle matches these exact details. Verification failed.' });
    }

    // Delete the matched vehicle (if there are multiple identical matches, delete the first one or all depending on business logic - here we delete the first one matched)
    const vehicleIdToDelete = vehicles[0].vehicle_id;
    await db.execute('DELETE FROM vehicles WHERE vehicle_id = ?', [vehicleIdToDelete]);
    
    res.json({ message: 'Vehicle successfully verified and deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Error executing match deletion', error: error.message });
  }
};
