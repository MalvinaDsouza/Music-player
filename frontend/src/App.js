import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/music/search?q=${searchTerm}`); // Adjust the URL to match your backend
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching songs:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.map((song) => (
          <li key={song.id}>
            {song.artist_name} - {song.track_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
