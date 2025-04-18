import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // מצביע ל־MainMap דרך App.js
import './index.css'; // Optional: Import your global styles
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
