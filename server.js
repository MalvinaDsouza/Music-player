const express = require('express');
const { createPool } = require('@google-cloud/sql');
const mysql = require('promise-mysql');

const music= require('./routes/music')




const app = express();
const PORT = process.env.PORT || 6000;


// const pool = createPool({
//   connectionName: 'bdataproc-412616:europe-west3:musicplayer',
//   user: 'root',
//   password: '12345',
//   database: 'music'
// });
const createUnixSocketPool = async config => {
  // Note: Saving credentials in environment variables is convenient, but not
  // secure - consider a more secure solution such as
  // Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
  // keep secrets safe.
  return mysql.createPool({
    user: 'root', // e.g. 'my-db-user'
    password: '12345', // e.g. 'my-db-password'
    database: 'music', // e.g. 'my-database'
    socketPath: '/cloudsql/dataproc-412616:europe-west3:musicplayer',
    // Specify additional properties here.
    ...config,
  });
};



const initializePool = async () => {
  try {
    const pool = await createUnixSocketPool();
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
        `SELECT * FROM songs WHERE title LIKE '%${searchTerm}%' OR artist LIKE '%${searchTerm}%'`
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