const db = require('./config/db');

async function alterDB() {
  try {
    await db.query('ALTER TABLE vehicles ADD COLUMN speed VARCHAR(100);');
    console.log('Added speed column');
  } catch(e) { console.log('speed column might exist', e.message); }
  
  try {
    await db.query('ALTER TABLE vehicles ADD COLUMN vehicle_number VARCHAR(100);');
    console.log('Added vehicle_number column');
  } catch(e) { console.log('vehicle_number column might exist', e.message); }
  
  process.exit();
}

alterDB();
