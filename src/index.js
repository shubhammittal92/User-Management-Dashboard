import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/styles.css';  // Relative path to the styles folder


import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);