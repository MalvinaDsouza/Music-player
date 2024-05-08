import React from 'react';
import './App.css';
import DatabaseSelector from './component/DatabaseSelector'; // Adjust the path accordingly
import Cloudsql from './component/Cloudsql';

 
function App() {
  return (
    <div className="App">
     
      <h1>Music</h1>
      <h3>Cloud SQL</h3>
      <Cloudsql />
      <h3>Cloud Firestore</h3>
      <DatabaseSelector />
    </div>
  );
}
 
export default App;