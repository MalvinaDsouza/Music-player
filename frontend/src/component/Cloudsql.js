import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './App.css'; // Import CSS file
import Chart from 'chart.js/auto'; 




function Cloudsql() {


  const [searchTime, setSearchTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [executionTime, setExecutionTime] = useState(null);
  const [addTime, setAddTime] = useState(0);
  const [updateTime, setUpdateTime] = useState(0);
  const [deleteTime, setDeleteTime] = useState(0);

  
  useEffect(() => {
    createPerformanceChart(); 
  }, [executionTime, searchTime,  addTime, updateTime, deleteTime]); 



  const createPerformanceChart = () => {
    const ctx = document.getElementById('performanceChart1');
    if (window.performanceChartInstance) {
      window.performanceChartInstance.destroy(); 
    }
    window.performanceChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Load Time', 'Search Time', 'Add Time', 'Update Time', 'Delete Time'],
        datasets: [{
          label: 'Performance Time (seconds)',
          data: [executionTime,  searchTime,  addTime, updateTime, deleteTime],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };


  const  handleRead = async () => {
    try {
      const startTime = performance.now(); // Start performance measurement
       await axios.get('http://localhost:4000/api/music');
      const endTime = performance.now(); // End performance measurement
      
       // Set execution time state
      setExecutionTime((endTime - startTime));
     
    } catch (error) {
      console.error('Error fetching music data:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const startTime = performance.now(); 
      const response = await axios.get(`http://localhost:4000/api/music/search?q=${searchTerm}`);
      const endTime = performance.now(); 
      
      setSearchTime((endTime - startTime));
      setSearchResults(response.data);


    } catch (error) {
      console.error('Error searching songs:', error);
    }
  };

  const handleAdd = async (newData) => {
    try {
      const startTime = performance.now(); 
  
      await axios.post('http://localhost:4000/api/music', newData);
  
      const endTime = performance.now(); 
      setAddTime((endTime - startTime));
  
    } catch (error) {
      console.error('Error adding song:', error);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const startTime = performance.now(); 

      await axios.put(`http://localhost:4000/api/music/${id}`, updatedData);

      const endTime = performance.now(); 
      setUpdateTime((endTime - startTime)/1000); 

     
    } catch (error) {
      console.error('Error updating song:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
    
      const startTime = performance.now();
      await axios.delete(`http://localhost:4000/api/music/${id}`);
      const endTime = performance.now();
      setDeleteTime((endTime - startTime));
      setSearchResults(searchResults.filter(song => song.id !== id));
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  return (
    <div>
     

      <h4>Performance Time:</h4>
      <canvas id="performanceChart1" width="400" height="200"></canvas>

      <div className="searchContainer">
        <input
          type="text"
          id="searchInput"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <br /> <br /> 

      </div>
    


      <button onClick={() => handleAdd({
  artist_name: '12345',
  track_name: 'Love',
  genre: 'POP',
  topic: 'Romantic'
})}>ADD</button>
  
      <button onClick={() => handleUpdate(9000, { artist_name: 'malvina' })}>Update</button>
      <button onClick={() => handleDelete(8)}>Delete</button> 
      <button onClick={handleRead}> Load data</button>
      <br /> <br /> 
      <p style={{ color: 'Purple', fontWeight: 'bold' }}>Search Time in Cloud SQL: {searchTime?.toFixed(2)} ms</p>
<p style={{ color: 'Blue', fontWeight: 'bold' }}>Add Time in Cloud SQL: {addTime?.toFixed(2)} ms</p>
<p style={{ color: 'Brown', fontWeight: 'bold' }}>Update Time in Cloud SQL: {updateTime?.toFixed(2)} ms</p>
<p style={{ color: 'Green', fontWeight: 'bold' }}>Delete Time in Cloud SQL: {deleteTime?.toFixed(2)} ms</p>
<p style={{ color: 'Red', fontWeight: 'bold' }}>Load Time in Cloud SQL: {executionTime?.toFixed(2)} ms</p>
    </div>
  );
}

export default Cloudsql;
