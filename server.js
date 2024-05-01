const express = require('express');
const mysql = require('promise-mysql');

const app = express();
const PORT = process.env.PORT || 6000;

const createTcpPool = async config => {
  return mysql.createPool({
    user: 'root', // Replace with your MySQL username
    password: '12345', // Replace with your MySQL password
    database: 'music', // Replace with your database name
    host: '35.242.201.102', // Replace with your Cloud SQL public IP address
    // Specify additional properties here.
    ...config,
  });
};

const initializePool = async () => {
  try {
    const pool = await createTcpPool();
    return pool;
  } catch (error) {
    console.error('Error initializing connection pool:', error);
    throw error;
  }
};

// Initialize the connection pool
initializePool().then(pool => {
  // API Endpoint for searching music
  app.get('/api/music/search', async (req, res) => {
    const searchTerm = req.query.q; // Get the search term from query parameters

    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        `SELECT * FROM playlist WHERE artist_name LIKE '%${searchTerm}%' OR track_name LIKE '%${searchTerm}%'`
      );
      connection.release();
      res.json(rows);
    } catch (error) {
      console.error('Error searching music:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}).catch(error => {
  console.error('Error initializing connection pool:', error);
  process.exit(1);
});
