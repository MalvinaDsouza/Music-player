const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const { performance } = require('perf_hooks');

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
  // Start the timer
  const startTime = performance.now();

  connection.query('SELECT * FROM playlist', (err, results) => {
    // End the timer
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;

    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
     // console.log('Read query executed in', elapsedTime, 'milliseconds');
      res.json(results);
    }
  });
});
// Define endpoint to search data by artist name
// router.get('/search', (req, res) => {
//     const { q } = req.query; // Get the search query parameter from the request
  
//     // Perform a search query using the provided artist name
//     connection.query('SELECT * FROM playlist WHERE artist_name LIKE ?', [`%${q}%`], (err, results) => {
//       if (err) {
//         console.error('Error searching the database:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//       } else {
//         res.json(results);
//       }
//     });
//   });

  router.get('/search', (req, res) => {
    const { q } = req.query; // Get the search query parameter from the request

    // Start the timer
    const startTime = performance.now();

    // Perform a search query using the provided artist name
    connection.query('SELECT * FROM playlist WHERE artist_name LIKE ?', [`%${q}%`], (err, results) => {
        // End the timer
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;

        if (err) {
            console.error('Error searching the database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Search query executed in', elapsedTime, 'milliseconds');
            res.json({ results, elapsedTime });
        }
    });
});

 
router.get('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM playlist WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results[0]); // Assuming only one record will be found for the given ID
    }
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const newData = req.body; // Assuming you send the updated data in the request body
  connection.query('UPDATE playlist SET ? WHERE id = ?', [newData, id], (err, result) => {
    if (err) {
      console.error('Error updating record:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Record updated successfully' });
    }
  });
});


router.delete('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM playlist WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting record:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Record deleted successfully' });
    }
  });
});



module.exports = router;
