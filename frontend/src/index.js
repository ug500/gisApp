import React from 'react';
import ReactDOM from 'react-dom/client';
import MunicipalitiesApp from './MunicipalitiesApp'; // Assuming MunicipalitiesApp.js is in the same directory
//import './index.css'; // Optional: Import your global styles

// Get the root element from your HTML (usually with the ID 'root')
const rootElement = document.getElementById('root');

// Create a React root
ReactDOM.createRoot(rootElement).render(<MunicipalitiesApp />);

// Render your MunicipalitiesApp component within the root
root.render(
  <React.StrictMode>
    <MunicipalitiesApp />
  </React.StrictMode>
);

// Optional: If you have any service workers, you might unregister them here
// import * as serviceWorker from './serviceWorker';
// serviceWorker.unregister();