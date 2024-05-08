const express = require('express');
const musicRouter = require('./routes/music');
const cors = require('cors');



const app = express();
const PORT = process.env.PORT || 4000;
//app.use(cors());



const corsOptions = {
  origin: 'http://localhost:3000', // URL of your React frontend
};

app.use(cors(corsOptions));

app.use(express.json());

// Mount the router at the /api/music endpoint
app.use('/api/music', musicRouter);




// Define a fallback route for any other endpoint
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});





// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
