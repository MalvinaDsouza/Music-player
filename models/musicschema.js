const mongoose = require('mongoose');

const musicSchema = mongoose.Schema({
    id: Number,
    artist_name: String,
track_name: String,
release_date: String,
genre: String,
topic: String,
})


module.exports = mongoose.model('Music', musicSchema);