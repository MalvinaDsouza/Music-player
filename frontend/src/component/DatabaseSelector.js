import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import Chart from 'chart.js/auto';
import firebaseConfig from '../firebaseConfig';
import './databaseSelector.css'


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function DatabaseSelector() {
  const [selectedOption, setSelectedOption] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadTime, setLoadTime] = useState(0); // State to store load time
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchTime, setSearchTime] = useState(0); // State to store search time
  const [uploadTime, setUploadTime] = useState(0); // State to store upload time
  const [crudTimes, setCrudTimes] = useState({
    create: 0,
    read: 0,
    update: 0,
    delete: 0
  });

  useEffect(() => {
    createPerformanceChart();
  }, [loadTime, searchTime, uploadTime, crudTimes]); // Update chart when performance times change

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleLoadData = async () => {
    setLoading(true);
    const startTime = performance.now();
    try {
      const snapshot = await db.collection('simple').get();
      const fetchedSongs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSongs(fetchedSongs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      const endTime = performance.now();
      setLoadTime((endTime - startTime) ); // Convert to seconds
    }
  };

  const handleSearch = () => {
    const startTime = performance.now();
    const result = songs.find(song => song.track_name.toLowerCase() === searchTerm.toLowerCase());
    setSearchResult(result);
    const endTime = performance.now();
    setSearchTime((endTime - startTime) ); // Convert to seconds
  };

  const handleBulkUpload = async () => {
    setLoading(true);
    const startTime = performance.now();
    try {
      const jsonData = [
        {
          "id": 0,
          "artist_name": "Ankith Reddy",
          "track_name": "Arjun Reddy",
          "release_date": 1950,
          "genre": "pop",
          "topic": "sadness"
        },
        {
          "id": 4,
          "artist_name": "frae",
          "track_name": "i believe",
          "release_date": 1950,
          "genre": "pop",
          "topic": "world/life"
        }
        // Add more data if needed
      ];
      const batch = db.batch();
      jsonData.forEach(data => {
        const docRef = db.collection('simple').doc(); // Auto-generated ID
        batch.set(docRef, data);
      });
      await batch.commit();
      console.log('Bulk data uploaded successfully!');
    } catch (error) {
      console.error('Error uploading bulk data:', error);
    } finally {
      setLoading(false);
      const endTime = performance.now();
      setUploadTime((endTime - startTime) / 1000); // Convert to seconds
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    const startTime = performance.now();
    try {
      // Perform create operation
      await db.collection('simple').add({ name: 'old' });
    } catch (error) {
      console.error('Error creating data:', error);
    } finally {
      setLoading(false);
      const endTime = performance.now();
      setCrudTimes(prevTimes => ({ ...prevTimes, create: (endTime - startTime)  }));
    }
  };

  const handleRead = async () => {
    setLoading(true);
    const startTime = performance.now();
    try {
      // Perform read operation
      await db.collection('simple').get();
    } catch (error) {
      console.error('Error reading data:', error);
    } finally {
      setLoading(false);
      const endTime = performance.now();
      setCrudTimes(prevTimes => ({ ...prevTimes, read: (endTime - startTime) / 1000 }));
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    const startTime = performance.now();
    try {
      // Perform update operation
      await db.collection('simple').doc('documentId').update({ name: 'Updated Record' });
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setLoading(false);
      const endTime = performance.now();
      setCrudTimes(prevTimes => ({ ...prevTimes, update: (endTime - startTime) / 1000 }));
    }
  };

  const handleDelete = async (documentId) => {
    setLoading(true);
    const startTime = performance.now();
    try {
      // Perform delete operation
      await db.collection('simple').doc(documentId).delete();
      setSongs(songs.filter(song => song.id !== documentId));
    } catch (error) {
      console.error('Error deleting data:', error);
    } finally {
      setLoading(false);
      const endTime = performance.now();
      setCrudTimes(prevTimes => ({ ...prevTimes, delete: (endTime - startTime)  }));
    }
  };

  const createPerformanceChart = () => {
    const ctx = document.getElementById('performanceChart');
    if (window.performanceChartInstance) {
      window.performanceChartInstance.destroy();
    }
    window.performanceChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Load Time', 'Search Time', 'Add Time', 'Update Time', 'Delete Time'],
        datasets: [{
          label: 'Performance Time (seconds)',
          data: [loadTime, searchTime, crudTimes.read, crudTimes.update, crudTimes.delete],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(255, 99, 132, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)'
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

  return (
    <div>
      <div>
        <h4>Performance Time:</h4>
        <canvas id="performanceChart" width="400" height="200"></canvas>
      </div>


      <div className="searchContainer">
        <input
          type="text"
          id="searchInput"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter Track Name"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      
      <br />
     
      {searchResult && (
        <div>
        <table id="musicTable">
        <thead>
          <tr><th>id</th>
            <th>Title</th>
            <th>Artist</th>
            <th>Genre</th>
            <th>Topic</th>
          </tr>
        </thead>
        <tbody id="musicTableBody">

        <tr >
    <td>{searchResult.id}</td>
    <td> {searchResult.artist_name}</td>
    
    <td>{searchResult.track_name}</td>
    <td>{searchResult.release_date}</td>
    <td>{searchResult.genre}</td>
    <td>{searchResult.topic}</td>
  </tr>

</tbody>
      </table>
      </div>
  
      )}
 <button onClick={handleCreate} >
       Add
      </button>
      <button onClick={handleUpdate} >
        Update
      </button>

      
      <button onClick={() => handleDelete(9)} >
             Delete
              </button>

      

      <button onClick={handleLoadData}>
        Load Data
      </button>
      <p style={{ color: 'Purple', fontWeight: 'bold' }}>Search Time in Cloud Firestore: {searchTime !== null ? searchTime.toFixed(2) : ''} ms</p>
<p style={{ color: 'Blue', fontWeight: 'bold' }}>Add Time in Cloud Firestore: {crudTimes.read !== null ? crudTimes.read.toFixed(2) : ''} ms</p>
<p style={{ color: 'Brown', fontWeight: 'bold' }}>Update Time in Cloud Firestore: {crudTimes.update !== null ? crudTimes.update.toFixed(2) : ''} ms</p>
<p style={{ color: 'Green', fontWeight: 'bold' }}>Delete Time in Cloud Firestore: {crudTimes.delete !== null ? crudTimes.delete.toFixed(2) : ''} ms</p>
<p style={{ color: 'Red', fontWeight: 'bold' }}>Load Time in Cloud Firestore: {loadTime !== null ? loadTime.toFixed(2) : ''} ms</p>
    </div>
  ); 
}

export default DatabaseSelector;