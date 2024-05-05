import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS file

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [executionTime, setExecutionTime] = useState(null);

  useEffect(() => {
    // Load initial data
    fetchMusicData();
  }, []);

  const   handleRead = async () => {
    try {
      const startTime = performance.now(); // Start performance measurement
      const response = await axios.get('http://localhost:4000/api/music');
      const endTime = performance.now(); // End performance measurement
      const elapsedTime = endTime - startTime; // Calculate elapsed time
      
      console.log('Read operation executed in', elapsedTime, 'milliseconds');
      console.log('Elapsed time:', elapsedTime); // Log elapsed time
      setExecutionTime(elapsedTime); // Set execution time state
      setExecutionTime(elapsedTime);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching music data:', error);
    }
  };


  const fetchMusicData = async () => {
    try {
      
      const response = await axios.get('http://localhost:4000/api/music');
     
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching music data:', error);
    }
  };
  const handleSearch = async () => {
    try {
      const startTime = performance.now(); // Get start time
      const response = await axios.get(`http://localhost:4000/api/music/search?q=${searchTerm}`);
      const endTime = performance.now(); // Get end time
      const elapsedTime = endTime - startTime; // Calculate elapsed time in milliseconds
      setExecutionTime(elapsedTime);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching songs:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const newData = { /* Object containing new music data */ };
      await axios.post('http://localhost:4000/api/music', newData);
      // Optionally, fetch updated data after adding
      fetchMusicData();
    } catch (error) {
      console.error('Error adding song:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/music/${id}`);
      // Remove the deleted item from the searchResults state
      setSearchResults(searchResults.filter(song => song.id !== id));
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  // const handleUpdate = async (id) => {
  //   try {
  //     const updatedData = { /* Object containing updated music data */ };
  //     await axios.put(`http://localhost:4000/api/music/${id}`, updatedData);
  //     // Optionally, fetch updated data after updating
  //     fetchMusicData();
  //   } catch (error) {
  //     console.error('Error updating song:', error);
  //   }
  // };

  return (
    <div>
      <h1>Melody Mix</h1>
      <div className="searchContainer">
        <input
          type="text"
          id="searchInput"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      

      <div id="buttonContainer">
        <button onClick={handleAdd}>Add</button>
        <button onClick={handleRead}>Read</button> 
      </div>

      {executionTime && (
  <p>Read query executed in {executionTime} milliseconds</p>
)}

      <table id="musicTable">
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Genre</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="musicTableBody">
  {Array.isArray(searchResults) && searchResults.map((song) => (
    <tr key={song.id}>
      <td>{song.track_name}</td>
      <td>{song.artist_name}</td>
      <td>{song.genre}</td>
      {/* <td>
        <button onClick={() => handleDelete(song.id)}>Delete</button>
        {/* Add update button 
      </td> */}
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
}

export default App;
