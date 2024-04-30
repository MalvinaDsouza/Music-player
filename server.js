const express = require('express');
const { createPool } = require('@google-cloud/sql');

const music= require('./routes/music')




const app = express();
const PORT = process.env.PORT || 6000;


const pool = createPool({
  connectionName: 'bdataproc-412616:europe-west3:musicplayer',
  user: 'root',
  password: '12345',
  database: 'music'
});




// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/music')
//   .then(() => console.log('Connected!'));



app.use((req,res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/api/music',music)




// API Endpoint for song search
// app.get('/api/songs', async (req, res) => {
//   const searchTerm = req.query.searchTerm;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query(
//       `SELECT * FROM songs WHERE title LIKE '%${searchTerm}%' OR artist LIKE '%${searchTerm}%'`
//     );
//     connection.release();
//     res.json(rows);
//   } catch (error) {
//     console.error('Error searching songs:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



app.get('/', (req,res) => {
  res.json({mssg: 'Welcome'})
})






// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
