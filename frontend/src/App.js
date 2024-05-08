import React from 'react';
import './App.css';
import DatabaseSelector from './component/DatabaseSelector'; // Adjust the path accordingly
import Cloudsql from './component/Cloudsql';

 
function App() {
  return (
    <div className="App">
     
    <Cloudsql />
      <h1>WELCOME TO MUSICFIE</h1>
      <DatabaseSelector />
    </div>
  );
}
 
export default App;