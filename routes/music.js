const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: '34.107.31.234',
  user: 'root',
  password: '12345',
  database: 'music'
});

// Connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database!');
  }
});

// Define endpoint to retrieve data from the database
router.get('/', (req, res) => {
  connection.query('SELECT * FROM playlist', (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// Define endpoint to search data by artist name
router.get('/search', (req, res) => {
    const { q } = req.query; // Get the search query parameter from the request
  
    // Perform a search query using the provided artist name
    connection.query('SELECT * FROM playlist WHERE artist_name LIKE ?', [`%${q}%`], (err, results) => {
      if (err) {
        console.error('Error searching the database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results);
      }
    });
  });

 



module.exports = router;
