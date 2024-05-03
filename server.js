const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 6000;

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
    
    // Query to retrieve tables
    connection.query('SHOW TABLES', (err, rows) => {
      if (err) {
        console.error('Error retrieving tables:', err);
      } else {
        console.log('Tables in the database:');
        rows.forEach(row => {
          console.log(row[`Tables_in_${connection.config.database}`]);
        });
      }
      
      // Close the connection after querying tables
      connection.end();
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
