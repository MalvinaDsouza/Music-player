const express = require('express');

const router = express.Router();
const Music = require('../models/musicschema')


// router.get('/', (req,res) => {
    
//         res.json({mssg: 'Welcome'})
      
// } ) 
router.get('/', async (req, res) => {
    const { artist_name } = req.query; // Get the artist name from the query parameters

    try {
        // Check if artist_name parameter is provided
        if (!artist_name) {
            return res.status(400).json({ message: 'Artist name is required' });
        }

        // Find documents where artist_name matches the specified value
        const music = await Music.find({ artist_name: artist_name });
        
        // Check if any matching documents were found
        if (music.length === 0) {
            return res.status(404).json({ message: 'Music not found' });
        }

        // Return the matching music documents
        res.status(200).json(music);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});




router.post('/', (req,res) => {
    
    res.json({mssg: 'post'})
  
} ) 

module.exports = router;