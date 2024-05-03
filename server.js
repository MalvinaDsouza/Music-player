const express = require('express');
const musicRouter = require('./routes/music');

const { getInsights } = require('./routes/cloud');

const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json());

// Mount the router at the /api/music endpoint
app.use('/api/music', musicRouter);

// Define a fallback route for any other endpoint
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});


app.get('/api/music', (req, res) => {
  const startTime = process.hrtime(); // Get start time

  pool.query('SELECT * FROM playlist', (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const endTime = process.hrtime(); // Get end time
      const elapsedTime = (endTime[0] - startTime[0]) * 1e9 + (endTime[1] - startTime[1]); // Calculate elapsed time in nanoseconds
      console.log('Database query executed in', elapsedTime / 1e6, 'milliseconds');

      res.json(results);
    }
  });
});

getInsights().catch(console.error);

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
