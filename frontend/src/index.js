import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Replace ReactDOM.render with createRoot
const root = createRoot(document.getElementById('root'));

// Instead of passing the App component directly to render, use the root object
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);