import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto'; 
import firebaseConfig from '../firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function MergComponent() { // Renamed to start with an uppercase letter
    const [songs, setSongs] = useState([]);
    const [searchTime1, setSearchTime1] = useState(0);
    const [searchTime, setSearchTime] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [executionTime, setExecutionTime] = useState(null);
    const [loadTime, setLoadTime] = useState(0);
    const [crudTimes, setCrudTimes] = useState({
        create: 0,
        read: 0,
        update: 0,
        delete: 0
    });
   
    const [addTime, setAddTime] = useState(0);
    const [updateTime, setUpdateTime] = useState(0);
    const [deleteTime, setDeleteTime] = useState(0);

    useEffect(() => {
        createPerformanceChart(); 
    }, [executionTime,crudTimes.read, searchTime,searchTime1, addTime, updateTime,crudTimes.update, deleteTime,crudTimes.delete]);  

    const createPerformanceChart = () => {
        const ctx = document.getElementById('performanceChart1');
        if (window.performanceChartInstance) {
            window.performanceChartInstance.destroy(); 
        }
        window.performanceChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Load SQL', 'Load Firestore', 'Search SQL', 'Search Firestore', 'Add SQL', 'Add Firestore', 'Update SQL', 'Update Firestore', 'Delete SQL', 'Delete Firestore'],
                datasets: [{
                    label: 'Performance Time (seconds)',
                    data: [executionTime, loadTime, searchTime, searchTime1, addTime, crudTimes.create, updateTime, crudTimes.update, deleteTime, crudTimes.delete],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)', // Red
                        'rgba(0, 0, 0, 0.5)',   // black
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(0, 0, 0, 0.5)', 
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(0, 0, 0, 0.5)', 
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(0, 0, 0, 0.5)', 
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(0, 0, 0, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)', // Red
                        'rgba(0, 0, 0, 1)',  // black
                        'rgba(255, 99, 132, 1)',
                        'rgba(0, 0, 0, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(0, 0, 0, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(0, 0, 0, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(0, 0, 0, 1)'
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

    const handleRead = async () => {
        const start = performance.now();
        try {
            const startTime = performance.now(); // Start performance measurement
            await axios.get('http://localhost:4000/api/music');
            const endTime = performance.now(); // End performance measurement
            setExecutionTime(endTime - startTime);

            const snapshot = await db.collection('simple').get();
            const fetchedSongs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSongs(fetchedSongs);
        } catch (error) {
            console.error('Error fetching music data:', error);
        } finally {
            const end = performance.now();
            setLoadTime((end - start) ); // Convert to seconds
        }
    };

    const handleSearch = async () => {
        try {
            const startTime = performance.now(); 
            const response = await axios.get(`http://localhost:4000/api/music/search?q=${searchTerm}`);
            const endTime = performance.now(); 
            setSearchTime((endTime - startTime));
            setSearchResults(response.data);
            const start = performance.now();
             const result = songs.find(song => song.artist_name.toLowerCase() === searchTerm.toLowerCase());
             setSearchResult(result);
            const end = performance.now();
            setSearchTime1((end - start) );
        } catch (error) {
            console.error('Error searching songs:', error);
        }
    };

    const handleAdd = async (newData) => {
        const start = performance.now();
        try {
            const startTime = performance.now(); 
            await axios.post('http://localhost:4000/api/music', newData);
            const endTime = performance.now(); 
            setAddTime((endTime - startTime));
            await db.collection('simple').add({ name: 'old' });
        } catch (error) {
            console.error('Error adding song:', error);
        } finally {
            const end = performance.now();
            setCrudTimes(prevTimes => ({ ...prevTimes, create: (end - start)  }));
        }
    };

    const handleUpdate = async (id, updatedData) => {
        const start = performance.now();
        try {
            const startTime = performance.now(); 
            await axios.put(`http://localhost:4000/api/music/${id}`, updatedData);
            const endTime = performance.now(); 
            setUpdateTime((endTime - startTime)); 
            await db.collection('simple').doc(id).update({ name: 'Updated Record' });
        } catch (error) {
            console.error('Error updating song:', error);
        } finally {
            const end = performance.now();
            setCrudTimes(prevTimes => ({ ...prevTimes, update: (end - start) }));
        }
    };

    const handleDelete = async (id) => {
        const start = performance.now();
        try {
            const startTime = performance.now();
            await axios.delete(`http://localhost:4000/api/music/${id}`);
            const endTime = performance.now();
            setDeleteTime((endTime - startTime));
            setSearchResults(searchResults.filter(song => song.id !== id));
            await db.collection('simple').doc(id).delete();
            // setSongs(songs.filter(song => song.id !== documentId));
        } catch (error) {
            console.error('Error deleting song:', error);
        } finally {
            const end = performance.now();
            setCrudTimes(prevTimes => ({ ...prevTimes, delete: (end - start)  }));
        }
    };

    return (
        <div>
            <h4>Performance Time:</h4>
            <canvas id="performanceChart1" width="500" height="400"></canvas>

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
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
    <div>
        <p style={{ color: 'Purple', fontWeight: 'bold' }}>Search Time in Cloud SQL: {searchTime?.toFixed(2)} ms</p>
        <p style={{ color: 'Blue', fontWeight: 'bold' }}>Add Time in Cloud SQL: {addTime?.toFixed(2)} ms</p>
        <p style={{ color: 'Brown', fontWeight: 'bold' }}>Update Time in Cloud SQL: {updateTime?.toFixed(2)} ms</p>
        <p style={{ color: 'Green', fontWeight: 'bold' }}>Delete Time in Cloud SQL: {deleteTime?.toFixed(2)} ms</p>
        <p style={{ color: 'Red', fontWeight: 'bold' }}>Load Time in Cloud SQL: {executionTime?.toFixed(2)} ms</p>
    </div>
    
    <div style={{ borderBottom: '1px dashed gray', width: '20%' }}></div>
    <br />
    <div>
        <p style={{ color: 'Purple', fontWeight: 'bold' }}>Search Time in Cloud Firestore: {searchTime1 !== null ? searchTime1.toFixed(2) : ''} ms</p>
        <p style={{ color: 'Blue', fontWeight: 'bold' }}>Add Time in Cloud Firestore: {crudTimes.create !== null ? crudTimes.create.toFixed(2) : ''} ms</p>
        <p style={{ color: 'Brown', fontWeight: 'bold' }}>Update Time in Cloud Firestore: {crudTimes.update !== null ? crudTimes.update.toFixed(2) : ''} ms</p>
        <p style={{ color: 'Green', fontWeight: 'bold' }}>Delete Time in Cloud Firestore: {crudTimes.delete !== null ? crudTimes.delete.toFixed(2) : ''} ms</p>
        <p style={{ color: 'Red', fontWeight: 'bold' }}>Load Time in Cloud Firestore: {loadTime !== null ? loadTime.toFixed(2) : ''} ms</p>
    </div>
</div>
        </div>
    );
}

export default MergComponent;
