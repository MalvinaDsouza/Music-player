import React from 'react';
import './App.css';
import DatabaseSelector from './component/DatabaseSelector'; // Adjust the path accordingly
import Cloudsql from './component/Cloudsql';
import Merg from './component/MergComponent';
import MergComponent from './component/MergComponent';


function App() {
  return (
    <div className="App">
      <h1>Music</h1>
      {/* <div className="database-container">
        <div className="cloudsql-container">
          <h3>Cloud SQL</h3>
          <Cloudsql />
        </div>
        <div className="database-selector-container">
          <h3>Cloud Firestore</h3>
          <DatabaseSelector /> */}

          <MergComponent />

        {/* </div>
      </div> */}
    </div>
  );
}

export default App;
