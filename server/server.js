const express = require('express');
const { createPool } = require('@google-cloud/sql');

const app = express();
const PORT = process.env.PORT || 3001;


const pool = createPool({
  connectionName: 'bright-sunlight-419913:europe-west3:music',
  user: 'root',
  password: '12345',
  database: 'music'
});


// API Endpoint for song search
app.get('/api/songs', async (req, res) => {
  const searchTerm = req.query.searchTerm;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT * FROM songs WHERE title LIKE '%${searchTerm}%' OR artist LIKE '%${searchTerm}%'`
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error searching songs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
