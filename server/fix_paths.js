const db = require('./config/db');

async function fixPaths() {
  try {
    await db.query(`UPDATE vehicles SET image = REPLACE(image, 'http://localhost:5000', '') WHERE image LIKE 'http://localhost:5000%'`);
    console.log('Successfully cleaned up old database images');
  } catch(e) { 
    console.log('Error updating old records', e.message); 
  }
  process.exit();
}

fixPaths();
