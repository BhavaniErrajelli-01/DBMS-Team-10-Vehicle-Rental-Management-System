const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    require('dotenv').config();
    const dbName = process.env.DB_NAME || 'vehicle_rental_db';

    // 1. Connect without database to create it if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      port: process.env.DB_PORT || 3306,
      ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined
    });

    console.log('Connected to MySQL server.');

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database ${dbName} created or already exists.`);

    await connection.query(`USE \`${dbName}\`;`);

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
