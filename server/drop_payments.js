const db = require('./config/db');

async function dropPayments() {
  try {
    await db.query('DROP TABLE IF EXISTS payments;');
    console.log('Successfully dropped payments table');
  } catch(e) { 
    console.log('Error dropping table', e.message); 
  }
  process.exit();
}

dropPayments();
