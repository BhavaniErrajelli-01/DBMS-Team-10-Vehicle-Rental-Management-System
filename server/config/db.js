const mysql = require('mysql2');

require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'vehicle_rental_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined
});

const promisePool = pool.promise();

// Test connection
promisePool.getConnection()
  .then(connection => {
    console.log('Successfully connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('Database "vehicle_rental_db" does not exist. Please run the init scripts or create it manually.');
    } else {
      console.error('Error connecting to MySQL:', err);
    }
  });

module.exports = promisePool;
