const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    // 1. Connect without database to create it if it doesn't exist
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
    });

    console.log('Connected to MySQL server.');

    await connection.query('CREATE DATABASE IF NOT EXISTS vehicle_rental_db;');
    console.log('Database vehicle_rental_db created or already exists.');

    await connection.query('USE vehicle_rental_db;');

    // 2. Read and execute the SQL file (or define inline)
    const sqlFile = fs.readFileSync(path.join(__dirname, '..', 'database.sql'), 'utf-8');
    const statements = sqlFile.split(';').map(stmt => stmt.trim()).filter(stmt => stmt.length > 0);

    for (let statement of statements) {
      await connection.query(statement);
    }

    console.log('All tables verified/created successfully.');
    await connection.end();
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

module.exports = initializeDatabase;
