const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'vehicle_rental_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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
