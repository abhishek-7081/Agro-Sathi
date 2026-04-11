import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/premium.css'

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Rejection:', event.reason);
});

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global Error:', { message, source, lineno, colno, error });
  return false;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
